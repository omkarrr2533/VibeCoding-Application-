#!/bin/bash
set -e
echo "Waiting for database..."
python manage.py migrate --no-input
python manage.py collectstatic --no-input || true
python manage.py seed_omjewellers || true
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py shell <<PY
from django.contrib.auth import get_user_model
User=get_user_model()
u=User.objects.filter(username="$DJANGO_SUPERUSER_USERNAME").first()
if not u:
    User.objects.create_superuser("$DJANGO_SUPERUSER_USERNAME", "$DJANGO_SUPERUSER_EMAIL", "$DJANGO_SUPERUSER_PASSWORD")
    print("Superuser created: $DJANGO_SUPERUSER_USERNAME")
else:
    print("Superuser exists")
PY
fi
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers ${GUNICORN_WORKERS:-3} --timeout 120 --access-logfile - --error-logfile -
