#!/bin/bash
set -e
echo "Setting up Om's Jewellers locally..."
cp .env.example .env
echo "Installing backend..."
cd backend && python3 -m venv .venv || true
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_omjewellers
echo "Create superuser (admin/admin123 for demo):"
echo "from django.contrib.auth import get_user_model; User=get_user_model(); User.objects.create_superuser('admin','admin@oms.com','admin123') if not User.objects.filter(username='admin').exists() else print('admin exists')" | python manage.py shell
cd ../frontend && npm install
echo "✅ Setup complete! Run: backend -> python manage.py runserver 0.0.0.0:8000, frontend -> npm run dev"
