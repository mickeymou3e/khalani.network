#!/bin/bash

set -euo pipefail

create-superuser () {
    local username="${DJANGO_SUPERUSER_USERNAME}"
    local email="${DJANGO_SUPERUSER_EMAIL}"
    local password="${DJANGO_SUPERUSER_PASSWORD}"
    cat <<EOF | python src/manage.py shell
from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username="$username").exists():
    User.objects.create_superuser("$username", "$email", "$password")
else:
    print('Superuser already exists, skip creation.')
EOF
}

echo "==> $(date +%H:%M:%S) ==> Collecting static files..."
python src/manage.py collectstatic --noinput
rm -rf ${DOCKER_NGINX_VOLUME_ROOT}/*
cp -r staticfiles/ ${DOCKER_NGINX_VOLUME_ROOT}/

echo "==> $(date +%H:%M:%S) ==> Migrating Django models..."
python src/manage.py migrate --noinput

echo "==> $(date +%H:%M:%S) ==> Create superuser..."
create-superuser

echo "==> $(date +%H:%M:%S) ==> Bootstrap..."
python src/manage.py bootstrap

echo "==> $(date +%H:%M:%S) ==> Running Gunicorn..."
exec gunicorn -c /app/src/config/gunicorn.py config.wsgi -b ${GUNICORN_BIND_SOCKET} -b 0.0.0.0:${GUNICORN_BIND_PORT} --chdir /app/src/