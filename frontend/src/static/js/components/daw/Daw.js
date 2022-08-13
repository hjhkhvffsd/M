import React, { useState, useEffect } from "react";
import Script from "next/script";
import EventEmitter from "events";
import { MediaPageStore } from '../../utils/stores/';
import { MemberContext } from '../../utils/contexts/';

import 'waveform-playlist/styles/playlist.scss';

import '../daw/style.css';
import '../daw/responsive.css';

// For extra buttons.
import 'bootstrap/dist/css/bootstrap.min.css';

import DawVideoPreview from './DawVideoPreview';
import DawTrackDrop from "./DawTrackDrop";
import DawControl from "./DawControl";
import DawSync from "./DawSync";
import DawTracks from "./DawTracks";

// See source code of this example:
// https://naomiaro.github.io/waveform-playlist/web-audio-editor.html

// See this exmample:
// https://github.com/naomiaro/waveform-playlist/blob/main/examples/basic-nextjs/pages/index.js
export default function Daw({ playerInstance }) {
  const [ee] = useState(new EventEmitter());
  
  // Disable & enable the trim button.
  const [trimDisabled, setTrimDisabled] = useState(true);
  
  // Disable & enable the record button.
  const [recordDisabled, setRecordDisabled] = useState(true);

  function onTrimDisabledChange(disabled) { // This callback is passed down to child component.
    setTrimDisabled(disabled);
  }
  
  function onRecordDisabledChange(disabled) { // This callback is passed down to child component.
    setRecordDisabled(disabled);
  }

  const [voices, setVoices] = useState(
    MemberContext._currentValue.can.hearVoice ? MediaPageStore.get('media-voices') : []
  );

  function onVoicesLoad() {
    const retrievedVoices = [...MediaPageStore.get('media-voices')];
    setVoices(retrievedVoices);
  }

  function onVoiceSubmit(uid) {
    console.log('SUBMIT_VOICE:', 'ok', 'UID:', uid);
  }

  function onVoiceSubmitFail(err) {
    console.warn('SUBMIT_VOICE:', 'bad', 'ERROR:', err);
  }

  useEffect(() => {
    navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    MediaPageStore.on('voices_load', onVoicesLoad);
    MediaPageStore.on('voice_submit', onVoiceSubmit);
    MediaPageStore.on('voice_submit_fail', onVoiceSubmitFail);

    return () => {
      MediaPageStore.removeListener('voices_load', onVoicesLoad);
      MediaPageStore.removeListener('voice_submit', onVoiceSubmit);
      MediaPageStore.removeListener('voice_submit_fail', onVoiceSubmitFail);
    };
  }, []);

  return (
    <>
      <Script
        src="https://kit.fontawesome.com/ef69927139.js"
        crossorigin="anonymous"
      />
      <main className="daw-container-inner">
        <div className="daw-top-row">
          <DawControl playerInstance={playerInstance} ee={ee}
            trimDisabled={trimDisabled}
            recordDisabled={recordDisabled}
          ></DawControl>
          <div className="video-preview-outer">
            <DawVideoPreview playerInstance={playerInstance}></DawVideoPreview>
          </div>
        </div>
        <DawTracks ee={ee} voices={voices}
          onRecordDisabledChange={onRecordDisabledChange}
          onTrimDisabledChange={onTrimDisabledChange}
        ></DawTracks>
        <div className="daw-bottom-row">
          <DawTrackDrop ee={ee}></DawTrackDrop>
          <DawSync ee={ee}></DawSync>
        </div>
      </main>
    </>
  );
}
