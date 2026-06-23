from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR should point to backend/
BASE_DIR = Path(__file__).resolve().parent.parent.parent

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'django_filters',
    'apps.news',
    'apps.ingest',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'apps.news.pagination.StandardResultsSetPagination',
    'PAGE_SIZE': 12,
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    # --- Authentication ---
    # This is a fully public, anonymous API — no user sessions or logins.
    # DRF's default SessionAuthentication enforces CSRF on every POST, which
    # causes 400 Bad Request for unauthenticated JSON clients that don't send
    # a CSRF token.  Setting this to empty disables CSRF enforcement cleanly
    # without needing @csrf_exempt on every view.
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    # --- Global rate limiting (Cloudflare- and Alwaysdata-aware) ---
    # CloudflareAnonThrottle reads CF-Connecting-IP (Cloudflare) or
    # X-Forwarded-For (Alwaysdata) so each real visitor gets their own
    # counter instead of sharing the shared-hosting load-balancer IP.
    'DEFAULT_THROTTLE_CLASSES': [
        'config.middleware.throttling.CloudflareAnonThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '60/min',
        'contact': '3/hour',    # Contact form: 3 submissions per real IP per hour
    },
    # --- JSON-only in production (development.py re-enables BrowsableAPIRenderer) ---
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

# Allow large formsets for the Django admin (e.g., 100 rows with list_editable)
# The default is 1000, which is quickly exceeded by the article feed.
DATA_UPLOAD_MAX_NUMBER_FIELDS = 10000
