from .base import *
import os

DEBUG = False

# ---------------- ALLOWED HOSTS ----------------
ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv('ALLOWED_HOSTS', '').split(',')
    if host.strip()
]

# ---------------- DATABASE ----------------
DB_ENGINE = os.getenv('DB_ENGINE', 'django.db.backends.postgresql')
DB_NAME = os.getenv('DB_NAME', '')
DB_USER = os.getenv('DB_USER', '')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_HOST = os.getenv('DB_HOST', '')
DB_PORT = os.getenv('DB_PORT', '5432')

if DB_NAME and DB_USER:
    DATABASES = {
        'default': {
            'ENGINE': DB_ENGINE,
            'NAME': DB_NAME,
            'USER': DB_USER,
            'PASSWORD': DB_PASSWORD,
            'HOST': DB_HOST,
            'PORT': DB_PORT,
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# ---------------- CHANNEL LAYER ----------------
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [os.getenv('REDIS_URL', 'redis://127.0.0.1:6379/0')],
        },
    },
}

# ---------------- SECURITY (Render FIX) ----------------
SECURE_SSL_REDIRECT = False

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'