#!/bin/bash
set -e
echo "🚀 Deploying Om's Jewellers..."
echo "1. Building..."
docker-compose build
echo "2. Starting..."
docker-compose up -d
echo "3. Waiting for DB..."
sleep 5
echo "4. Migrating..."
docker-compose exec backend python manage.py migrate --no-input
echo "5. Seeding..."
docker-compose exec backend python manage.py seed_omjewellers || true
echo "✅ Deploy complete! Check: http://localhost (nginx) and http://localhost:8000/api/v1/health/"
