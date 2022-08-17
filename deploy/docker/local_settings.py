FRONTEND_HOST = 'https://micrufun.com'
PORTAL_NAME = 'MICRUFUN'
SECRET_KEY = 'ma!s3^b-cw!f#7s6s0m3*jx77a@riw(7701**(r=ww%w!2+yk2'
POSTGRES_HOST = 'db'
REDIS_LOCATION = "redis://redis:6379/1"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "mediacms",
        "HOST": POSTGRES_HOST,
        "PORT": "5432",
        "USER": "mediacms",
        "PASSWORD": "mediacms",
    }
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_LOCATION,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}

# CELERY STUFF
BROKER_URL = REDIS_LOCATION
CELERY_RESULT_BACKEND = BROKER_URL

MP4HLS_COMMAND = "/home/mediacms.io/bento4/bin/mp4hls"

DEBUG = False

### Set email settings
### Set correct settings per provider
DEFAULT_FROM_EMAIL = 'micrufun@gmail.com'
EMAIL_HOST_PASSWORD = '***REMOVED***'
EMAIL_HOST_USER = 'micrufun@gmail.com'
EMAIL_USE_TLS = True
SERVER_EMAIL = DEFAULT_FROM_EMAIL
EMAIL_HOST = 'gmail.com'
EMAIL_PORT = 587
ADMIN_EMAIL_LIST = ['micrufun@gmail.com']

### # Deploy changes
###
### ## Pull new commits by Git. Then, if server is not up, bring it up:
###
### sudo su
### cd /home/mediacms.io/mediacms/
### /usr/local/bin/docker-compose -f docker-compose-letsencrypt.yaml up -d
###
### ## Deploy changes on server after modifying database table models:
###
### sudo su
### /usr/local/bin/docker-compose exec -T web python manage.py makemigrations
### /usr/local/bin/docker-compose exec -T web python manage.py migrate
### /usr/local/bin/docker-compose restart web celery_worker celery_beat
###
### ## Adding admin to admin panel:
###
### sudo su
### /usr/local/bin/docker-compose exec web python manage.py createsuperuser
###
### ## If Django version is messed up by playing around with `python -m pip install ...`, it can restored by:
###
### sudo su
### /usr/local/bin/docker-compose exec web python -m pip install -r requirements.txt
### /usr/local/bin/docker-compose restart web celery_worker celery_beat
