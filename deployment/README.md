# Deployment Guide — Om's Jewellers

This guide covers **local**, **Docker**, and **cloud** deployment with PostgreSQL.

## Quick Check — Is it deploy-ready?
- [x] Dockerfile backend (multi-stage, entrypoint with migrate) + frontend (Node → Nginx)
- [x] docker-compose.yml with healthchecks, postgres, redis, nginx, volumes
- [x] settings_prod.py with WhiteNoise, dj-database-url, S3 optional, security headers
- [x] .env.example with all required vars
- [x] gunicorn.conf.py, entrypoint.sh (auto-superuser)
- [x] Seed command with 32 products, collections, testimonials, reviews, orders

## 1. Local (SQLite, dev)
```bash
cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
python manage.py migrate && python manage.py seed_omjewellers && python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000  # http://localhost:8000/api/docs/

cd ../frontend && npm install && npm run dev  # http://localhost:5173 (proxies /api)
```

## 2. Docker (Postgres, prod-like)
```bash
cp .env.example .env
# Edit .env: set POSTGRES_PASSWORD, SECRET_KEY (50+ chars), DEBUG=False for prod
docker-compose up --build
# Wait for healthchecks: backend:8000, frontend via nginx:80
docker-compose exec backend python manage.py seed_omjewellers
docker-compose exec backend python manage.py createsuperuser
```
- Postgres data in `pgdata` volume — backup with `docker-compose exec db pg_dump -U omuser omjewellers > backup.sql`
- Media in `backend_media` volume — persist to S3 in prod (set USE_S3=True)

## 3. Render (recommended free tier)
1. Fork this repo to your GitHub
2. Render → New → Blueprint → connect repo → `render.yaml` auto-detects 2 services + DB
3. Set env: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
4. Deploy — Render runs `migrate` + `collectstatic` via buildCommand, then `seed_omjewellers` via entrypoint
5. Set custom domain + HTTPS (auto)

## 4. Railway
1. Railway → New Project → Deploy from GitHub → select `railway.toml`
2. Add Postgres plugin → set `DATABASE_URL` (auto), set `SECRET_KEY`, `ALLOWED_HOSTS=your-app.up.railway.app`
3. Deploy backend; frontend → Vercel (see below)

## 5. Frontend on Vercel
1. Vercel → New Project → Import `frontend/` → Framework: Vite → Build: `npm run build`, Output: `dist`
2. Env: `VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1`
3. Deploy — SPA rewrites handled via vercel.json

## 6. Production Checklist
- [ ] `DEBUG=False`, `SECRET_KEY` 50+ random, `ALLOWED_HOSTS=yourdomain.com`
- [ ] `DATABASE_URL=postgresql://...?sslmode=require`, `DB_SSL_REQUIRE=True`
- [ ] Set live Razorpay keys + webhook secret, configure webhook URL: `POST /api/v1/payments/webhook/`
- [ ] Set SMTP (SendGrid/Mailgun) — test via `python manage.py sendtestemail`
- [ ] Set S3 (USE_S3=True + AWS_*) — `python manage.py collectstatic` should upload to S3
- [ ] Enable HSTS, SSL redirect, set `SECURE_*`, add Sentry (`SENTRY_DSN`)
- [ ] Backup cron: `pg_dump` daily + S3 sync for `media/`
- [ ] Monitoring: `/api/v1/health/`, uptime check, log aggregation

## 7. Database — More Data
Seed creates:
- 32 products (Gold/Diamond/Bridal/Silver + 8 collections)
- 10 categories, 8 collections, 6 coupons, 12 testimonials, 40+ reviews, 4 demo users, addresses, sample delivered order
- To reset: `python manage.py flush --no-input && python manage.py migrate && python manage.py seed_omjewellers`
- To add your data: use Django Admin (`/admin/`) → Catalog → Add Product (images, variants, specs)

## 8. Zero-downtime Updates
```bash
git pull origin main
docker-compose build backend frontend
docker-compose up -d --no-deps backend
docker-compose exec backend python manage.py migrate
```

## 9. Troubleshooting
- `ALLOWED_HOSTS` error → add domain to `ALLOWED_HOSTS`
- `CORS` → set `CORS_ALLOWED_ORIGINS` to frontend URL
- Media 404 → ensure `MEDIA_URL` + `MEDIA_ROOT` + nginx `location /media/` alias, or S3 `MEDIA_URL`
- DB connection → verify `DATABASE_URL` format, ensure postgres reachable, run `pg_isready`
- Razorpay webhook 400 → verify `RAZORPAY_WEBHOOK_SECRET` + endpoint `/api/v1/payments/webhook/` with `X-Razorpay-Signature`

Need help? See `README.md` or open an issue.
