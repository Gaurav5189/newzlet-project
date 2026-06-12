from .base import *
import os

import dj_database_url
from decouple import config
from pathlib import Path

SECRET_KEY = config('SECRET_KEY')

DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = [h.strip() for h in config('ALLOWED_HOSTS', default='').split(',') if h.strip()]


# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
# dummy for collectstatic only in production 
# because collectstatic fails when there is no db in docker container
DATABASE_URL = config(
    "DATABASE_URL",
    default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}"
)

# this is for production where we use postgresql
ssl_require = config("DB_SSL_REQUIRE", default=DATABASE_URL.startswith("postgres"), cast=bool)
DATABASES = {
    "default": dj_database_url.parse(
        DATABASE_URL,
        conn_max_age=600,
        ssl_require=ssl_require
    )
}

# ---------------------------------------------------------------------------
# Cache (Redis)
# ---------------------------------------------------------------------------
# Redis setup for caching which works with docker-compose to show css on admin panel
REDIS_URL = config("REDIS_URL", default=None)

if REDIS_URL:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.redis.RedisCache",
            "LOCATION": REDIS_URL,
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        }
    }

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = [o.strip() for o in config('CORS_ALLOWED_ORIGINS', default='').split(',') if o.strip()]
CORS_ALLOW_CREDENTIALS = False  # API is stateless; no cookies/auth headers needed
CORS_ALLOW_METHODS = ['GET', 'POST', 'OPTIONS']
CORS_ALLOW_HEADERS = [
    'accept',
    'content-type',
    'x-api-key',
]

# ---------------------------------------------------------------------------
# Static files
# ---------------------------------------------------------------------------
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ---------------------------------------------------------------------------
# Secrets / API keys
# ---------------------------------------------------------------------------
# n8n ingest api key
N8N_INGEST_API_KEY = config('N8N_INGEST_API_KEY', default=None)

# ---------------------------------------------------------------------------
# Middleware (order matters)
# ---------------------------------------------------------------------------
# Insert whitenoise middleware after SecurityMiddleware
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
# Append custom security headers middleware at the end
MIDDLEWARE.append('config.middleware.security.SecurityHeadersMiddleware')

# ---------------------------------------------------------------------------
# SSL / HTTPS enforcement
# ---------------------------------------------------------------------------
SECURE_SSL_REDIRECT = False     # Already forces HTTPS at the server level
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# ---------------------------------------------------------------------------
# HSTS — HTTP Strict Transport Security
# ---------------------------------------------------------------------------
SECURE_HSTS_SECONDS = 31536000          # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# ---------------------------------------------------------------------------
# Cookie security
# ---------------------------------------------------------------------------
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True           # Default, made explicit
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_AGE = 1209600            # 2 weeks (seconds)

# ---------------------------------------------------------------------------
# Content security headers
# ---------------------------------------------------------------------------
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'               # API-only backend — never framed

# ---------------------------------------------------------------------------
# CSRF trusted origins (required Django 4+)
# ---------------------------------------------------------------------------
CSRF_TRUSTED_ORIGINS = [o.strip() for o in config('CSRF_TRUSTED_ORIGINS', default='').split(',') if o.strip()]

# ---------------------------------------------------------------------------
# Request size limits — prevent abuse
# ---------------------------------------------------------------------------
DATA_UPLOAD_MAX_MEMORY_SIZE = 5_242_880       # 5 MB
DATA_UPLOAD_MAX_NUMBER_FIELDS = 100

# ---------------------------------------------------------------------------
# Security logging
# ---------------------------------------------------------------------------
LOG_DIR = BASE_DIR / 'logs'
LOG_DIR.mkdir(exist_ok=True)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[{asctime}] {levelname} {name} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'security_file': {
            'class': 'logging.FileHandler',
            'filename': str(LOG_DIR / 'security.log'),
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django.security': {
            'handlers': ['console', 'security_file'],
            'level': 'WARNING',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console', 'security_file'],
            'level': 'WARNING',
            'propagate': False,
        },
    },
}
