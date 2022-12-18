import React, { useEffect, useRef, useState, useImperativeHandle, useCallback } from 'react';
import { findDOMNode } from 'react-dom';
import { hasClassname } from '../../../utils/helpers/dom';
import { default as Popup } from './Popup.jsx';

export function PopupContent(props) {
  const wrapperRef = useRef(null);

  const [isVisible, setVisibility] = useState(false);

  const onClickOutside = useCallback((ev) => {
    if (hasClassname(ev.target, 'popup-fullscreen-overlay')) {
      hide();
      return;
    }

    const domElem = findDOMNode(wrapperRef.current);

    // To avoid this error on Firefox:
    // Uncaught TypeError: e.path is undefined
    // And this error on Chromium:
    // Uncaught TypeError: Cannot read properties of undefined (reading 'indexOf')
    //
    // https://stackoverflow.com/a/39245638/3405291
    //
    // It allows for both the old way and the new, standard way.
    // So will do its best cross-browser.
    var path = ev.path || (ev.composedPath && ev.composedPath());
    if (path) {
      if (-1 === path.indexOf(domElem)) {
        hide();
      }
    } else {
      Console.log("This browser doesn't supply event path information")
      // TODO: Should call hide()?
    }
  }, []);

  const onKeyDown = useCallback((ev) => {
    let key = ev.keyCode || ev.charCode;
    if (27 === key) {
      onClickOutside(ev);
    }
  }, []);

  function enableListeners() {
    document.addEventListener('click', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
  }

  function disableListeners() {
    document.removeEventListener('click', onClickOutside);
    document.removeEventListener('keydown', onKeyDown);
  }

  function show() {
    setVisibility(true);
  }

  function hide() {
    disableListeners();
    setVisibility(false);
  }

  function toggle() {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  }

  function tryToHide() {
    if (isVisible) {
      hide();
    }
  }

  function tryToShow() {
    if (!isVisible) {
      show();
    }
  }

  useEffect(() => {
    if (isVisible) {
      enableListeners();
      if ('function' === typeof props.showCallback) {
        props.showCallback();
      }
    } else {
      if ('function' === typeof props.hideCallback) {
        props.hideCallback();
      }
    }
  }, [isVisible]);

  useImperativeHandle(props.contentRef, () => ({
    toggle,
    tryToHide,
    tryToShow,
  }));

  return isVisible ? (
    <Popup ref={wrapperRef} className={props.className} style={props.style}>
      {props.children}
    </Popup>
  ) : null;
}
