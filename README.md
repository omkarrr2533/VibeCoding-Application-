# Om's Jewellers — Premium Luxury Jewellery E-Commerce Platform

A production-oriented luxury jewellery showroom with cinematic storytelling, immersive 3D, and full e-commerce.

## Quick Start (Local Dev - SQLite, No Docker)

### Prerequisites
- Python 3.11+
- Node 18+
- pip & npm

### Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example ../.env  # or create backend/.env
python manage.py migrate
python manage.py seed_omjewellers
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```
Backend at http://localhost:8000/api/v1/  | Admin at http://localhost:8000/admin/ | Docs at http://localhost:8000/api/docs/

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend at http://localhost:5173

### Environment Variables

Backend `backend/.env` or root `.env`:
```
SECRET_KEY=...
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

Frontend `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Docker
```bash
docker-compose up --build
```

### Tests
```bash
cd backend
pytest -v
cd ../frontend
npm test
```

### Production Notes
- Set DEBUG=False, strong SECRET_KEY, ALLOWED_HOSTS
- Use Postgres, configure DATABASE_URL
- Set up Razorpay live keys, webhook secret
- Configure S3 / S3-compatible storage for media
- Use Gunicorn + Nginx, HTTPS via Let's Encrypt
