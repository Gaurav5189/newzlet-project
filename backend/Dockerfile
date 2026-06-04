FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Generate Django static files during image build.
# SECRET_KEY is set inline here only for this RUN layer — it is NOT baked
# into the image as a permanent env var. The real SECRET_KEY is injected
# at runtime by Northflank environment variables.
RUN SECRET_KEY=build-only-not-used-at-runtime \
    python manage.py collectstatic \
    --settings=config.settings.production \
    --noinput

# Run as a non-root system user for security.
# chown ensures the app user can write .pyc caches and temp files.
RUN addgroup --system appgroup \
    && adduser --system --ingroup appgroup appuser \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

# Health check using the always-available admin login page.
# start-period gives time for migrations to complete before checks begin.
HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
    CMD python -c \
        "import urllib.request; urllib.request.urlopen('http://localhost:8000/admin/login/')" \
    || exit 1

# 1 worker + 2 threads (gthread)
# can be Overridden by setting GUNICORN_WORKERS / GUNICORN_THREADS via Northflank env vars.
CMD sh -c "python manage.py migrate --settings=config.settings.production \
    && gunicorn config.wsgi:application \
       --bind 0.0.0.0:8000 \
       --worker-class gthread \
       --workers ${GUNICORN_WORKERS:-1} \
       --threads ${GUNICORN_THREADS:-2} \
       --access-logfile -"