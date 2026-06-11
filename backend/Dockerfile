FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Generate Django static files during image build.
RUN SECRET_KEY=build-only-not-used-at-runtime \
    python manage.py collectstatic \
    --settings=config.settings.production \
    --noinput

# Run as a non-root system user for security.
RUN addgroup --system appgroup \
    && adduser --system --ingroup appgroup appuser \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

# Health check using the admin login page.
HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
    CMD python -c \
        "import urllib.request; urllib.request.urlopen('http://localhost:8000/admin/login/')" \
    || exit 1

# Start gunicorn immediately without blocking on migrations
CMD gunicorn config.wsgi:application \
       --bind 0.0.0.0:8000 \
       --worker-class gthread \
       --workers ${GUNICORN_WORKERS:-1} \
       --threads ${GUNICORN_THREADS:-2} \
       --access-logfile -