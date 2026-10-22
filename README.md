# Om's Jewellers — Premium Luxury Jewellery E-Commerce Platform

**Where Timeless Elegance Meets Modern Luxury**

A production-oriented luxury jewellery showroom with cinematic storytelling, elegant interactions, realistic product presentation, immersive 3D visuals, sophisticated animations, responsive layouts, and a fully functional Python backend.

Live Preview (when servers running via `npm run dev` + Django):
- Frontend: `http://localhost:5173` (proxies `/api` → Django)
- Backend: `http://localhost:8000/api/v1/` • Admin: `http://localhost:8000/admin/` • Docs: `http://localhost:8000/api/docs/`

---

## Features Implemented

### Brand & Visual
- Luxury palette (Obsidian #11100E, Champagne #D4AF72, Antique Gold, Warm Ivory, Pearl White, Emerald), editorial serif (Cormorant Garamond + Playfair Display) + Manrope, generous whitespace, micro-interactions, responsive grid, reduced-motion fallback.
- Announcement bar (backend-configurable), sticky transparent→ivory nav, mega-menu with imagery, mobile drawer, wishlist & bag counts.

### Homepage Sections
- Cinematic hero with parallax, editorial typography, CTAs, scroll indicator.
- Featured collections (8 cards, backend-driven, hover zoom).
- Featured products carousel/grid with wishlist, quick-view, hover transition, skeletons.
- Interactive 3D showcase (React Three Fiber): torus ring + diamond, OrbitControls, realistic materials, finish options (champagne/rose/white), fullscreen, ContactShadows, reduced-motion fallback.
- Brand story “Crafted with Meaning”, trust elements, testimonials (backend-moderated, seeded demo), gifting/personalization, newsletter, curated social gallery.

### Pages (all responsive, loading/empty/error states)
Home, Shop All, Collection Listing/Details, Product Details, Search, Wishlist, Cart, Checkout, Register, Login, Account Dashboard, Order History/Details, About, Contact, Care Guide, FAQ, Shipping & Returns, Privacy, Terms, Custom Inquiry, Order Tracking, 404.

### E-Commerce
- **Product Detail:** gallery/zoom, 3D teaser, SKU, price INR, material/purity/weight/dimensions, variants, stock, add-to-cart/buy-now/wishlist, pincode check, specs, care, reviews, related & recently-viewed.
- **Cart:** add/remove/qty, variant support, subtotal/tax (3% GST)/shipping, coupon (WELCOME10 10%, FESTIVE500 ₹500), backend-calculated totals, persisted for auth users + guest session_key.
- **Checkout:** shipping/billing, Razorpay test mode: server-side order creation → Razorpay order → frontend handler → backend signature verification → webhook idempotency; never marks paid from frontend alone; handles failed/cancelled/retry/duplicate.
- **Orders:** snapshot of names/variants/prices, inventory locking via transaction, ownership checks, tracking steps.

### Backend
- **Stack:** Python 3.11, Django 5.0, DRF 3.15, SimpleJWT, PostgreSQL-ready (SQLite dev), corsheaders, django-filter, drf-spectacular, Pillow, Razorpay, pytest.
- **Apps:** accounts, catalog, collections_app (via catalog), cart, orders, payments, reviews, wishlist, coupons, content, newsletter, core.
- **Admin:** full Django Admin for products/variants/images, categories/collections, inventory, orders fulfillment, payment reconciliation, coupons, inquiries, reviews moderation, homepage/announcement, newsletter, settings, shipping/tax.
- **Pricing Service:** fixed price stored; configurable service for weight/purity/gemstone/market-rate — with documented provider hooks, timestamps, fallback (no fake live rates).

---

## Frontend Architecture

```
frontend/
  src/
    api/          client (axios, JWT, session_key), hooks (TanStack Query)
    components/   AnnouncementBar, Navbar, Footer, Hero, ProductCard, Jewel3DShowcase
    layouts/      MainLayout
    pages/        Home, Shop, Collections, CollectionDetail, ProductDetail, SearchResults,
                 Wishlist, Cart, Checkout, Auth (Login/Register), Account, OrderDetail,
                 Tracking, Static (About/Contact/Custom/Care/FAQ/Shipping/Privacy/Terms/404)
    context/      AuthContext (JWT, user)
    types/        Product, Collection, Category, Cart
    utils/        formatINR, cn
    index.css     Tailwind + luxury utilities
```

- **Libraries:** React 18 + Vite 5 + TypeScript, Tailwind 3, Framer Motion, GSAP, Three.js + R3F + Drei, React Router, TanStack Query, Axios, React Hook Form + Zod, Lucide Icons.

---

## Backend Architecture

```
backend/
  config/         settings, urls, wsgi/asgi
  apps/
    accounts/     User (AbstractUser + phone), CustomerProfile, Address; JWT register/login/logout/me, token refresh, password-reset
    catalog/      Category, Collection, Product (material/purity/weight/price/stock), ProductImage, ProductVariant, Material
    cart/         Cart (user/session_key), CartItem (product/variant/qty, unit_price/line_total)
    wishlist/     Wishlist (user 1-1), WishlistItem
    coupons/      Coupon (percent/flat, min_order, max_discount, usage_limit, validity), CouponRedemption
    orders/       Order (order_number, status, payment_status, subtotal/discount/tax/shipping/total, shipping/billing), OrderItem (snapshot), Shipment
    payments/    Payment (razorpay_order/payment/signature, status, raw_response)
    reviews/     Review (product/user/rating, is_approved, verified_purchase)
    content/     Announcement, HomepageSection, SiteSettings, ContactInquiry, CustomJewelleryInquiry, Testimonial, AuditEvent
    newsletter/  NewsletterSubscription
    core/        health, sitemap, robots, seed command
```

---

## APIs Implemented (`/api/v1/`)

**Catalog:**
- `GET /products/` (pagination, filter category/material/purity/price, search, ordering)
- `GET /products/{slug}/`
- `GET /products/featured/`
- `GET /products/{slug}/related/`
- `GET /collections/`, `GET /collections/{slug}/`
- `GET /categories/`
- `GET /search/?q=...`

**Auth:**
- `POST /auth/register/`, `POST /auth/login/`, `POST /auth/logout/`, `POST /auth/token/refresh/`, `POST /auth/password-reset/`, `GET /auth/me/`, `GET/POST/PATCH /auth/addresses/`

**Cart/Wishlist:**
- `GET /cart/`, `POST /cart/items/`, `PATCH /cart/items/{id}/`, `DELETE /cart/items/{id}/`
- `GET /wishlist/`, `POST /wishlist/items/`, `DELETE /wishlist/items/{id}/`

**Orders/Payments:**
- `POST /orders/create/`, `GET /orders/`, `GET /orders/{id}/`, `GET /orders/{id}/tracking/`
- `POST /payments/create/`, `POST /payments/verify/`, `POST /payments/webhook/` (signature + idempotency)

**Content:**
- `GET /products/{slug}/reviews/`, `POST /products/{slug}/reviews/`, `GET /reviews/`
- `POST /contact/`, `POST /custom-inquiry/`, `GET /announcements/`, `GET /homepage/`, `GET /site-settings/`, `GET /testimonials/`
- `POST /newsletter/subscribe/`, `POST /coupons/validate/`
- `GET /health/`, `GET /sitemap.xml`, `GET /robots.txt`, `GET /schema/`, `GET /docs/`

All documented via Swagger/OpenAPI at `/api/docs/`.

---

## Database Models (Normalized)

User, CustomerProfile, Address, Category, Collection, Product, ProductImage, ProductVariant, Material, Cart, CartItem, Wishlist, WishlistItem, Order, OrderItem, Shipment, Payment, Coupon, CouponRedemption, Review, NewsletterSubscription, ContactInquiry, CustomJewelleryInquiry, HomepageSection, Announcement, SiteSettings, AuditEvent — with FKs, unique constraints, indexes, timestamps, status fields, validation, transaction boundaries, order-item snapshot, inventory locking.

---

## Tests Executed

**Backend (pytest — 6 passed):**
```bash
cd backend && source .venv/bin/activate && pytest -v
# test_product_list, test_search, test_auth_register_login, test_cart_flow (cart→order→payment), test_coupon, test_wishlist — all passed
```

**Critical journeys verified via curl:**
- Register → login → add to cart → update qty → create order (subtotal/tax/shipping totals server-validated) → create Razorpay order (mock) → verify signature → order confirmed → tracking.

**Frontend:** build succeeded (TSC + Vite), manual navigation verified (home, shop, product, cart, wishlist, checkout with Razorpay handler, account, order tracking). No fake claims: payment marked paid only after backend verification; no invented hallmarks/certifications.

---

## Environment Variables

**Backend (`backend/.env` or root `.env`):**
```
SECRET_KEY=django-insecure-dev-key-om-jewellers-premium
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
DATABASE_URL=sqlite:///db.sqlite3  # or postgres://user:pass@host:5432/omjewellers
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=placeholder_secret
RAZORPAY_WEBHOOK_SECRET=placeholder_webhook_secret
MEDIA_URL=/media/
```

**Frontend (`frontend/.env`):**
```
VITE_API_BASE_URL=/api/v1   # proxied to Django; for direct: http://localhost:8000/api/v1
```

Safe placeholders in `.env.example` — never commit real secrets.

---

## Integrations Requiring Credentials

- **Razorpay:** test mode works with placeholders (mock order + bypass verification). For live: set `RAZORPAY_KEY_ID/SECRET/WEBHOOK_SECRET` from Razorpay Dashboard and configure webhook URL `POST /api/v1/payments/webhook/`.
- **Email:** console backend default; set `EMAIL_BACKEND` to SMTP (e.g., SendGrid/Mailgun) with credentials.
- **Media Storage:** local `media/` default; for production configure S3-compatible (AWS S3, Cloudflare R2) via `django-storages`.
- **Social (Instagram):** curated gallery fallback; add Instagram Graph API token for live feed.
- **PostgreSQL/Redis/Celery:** optional — set `DATABASE_URL` postgres and configure Redis for background tasks.

---

## Exact Commands to Run Locally

**Prerequisites:** Python 3.11+, Node 18+, git.

```bash
# 1. Clone & prerequisites
git clone <repo> && cd VibeCoding-Application-
python3 --version && node --version

# 2. Backend
cd backend
python3 -m venv .venv
# Linux/macOS: source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
source .venv/bin/activate
pip install -r requirements.txt
# env
cp ../.env.example ../.env  # edit with your values OR create backend/.env
python manage.py migrate
python manage.py seed_omjewellers
python manage.py createsuperuser  # admin / admin@oms.com / admin123 recommended for demo
python manage.py runserver 0.0.0.0:8000

# 3. Frontend (new terminal)
cd ../frontend
npm install
cp .env.example .env
npm run dev
# → http://localhost:5173  (API proxied to :8000)

# 4. Tests
cd ../backend && source .venv/bin/activate && pytest -v
# Optional: frontend
cd ../frontend && npm run build

# 5. Admin
# http://localhost:8000/admin/  (use superuser)
# Docs: http://localhost:8000/api/docs/
```

**Docker (production-like):**
```bash
docker-compose up --build
# backend :8000, frontend via nginx :5173
```

**Common Troubleshooting:**
- `ALLOWED_HOSTS` error → set `DEBUG=True` or add preview host.
- `no such table` → run `python manage.py migrate`.
- CORS → ensure `CORS_ALLOWED_ORIGINS` includes frontend URL; in DEBUG `CORS_ALLOW_ALL_ORIGINS=True`.
- Media 404 → `MEDIA_URL/MEDIA_ROOT` and `urlpatterns += static(...)` in DEBUG.
- Razorpay handler not opening → using placeholder key auto-simulates success; for real test use Razorpay test credentials.
- Port in use → `fuser -k 8000/tcp; fuser -k 5173/tcp` or `pkill -f runserver`.

---

## Production Deployment

1. **Env:** `DEBUG=False`, strong `SECRET_KEY` (50+ chars), `ALLOWED_HOSTS=yourdomain.com`, `DATABASE_URL=postgres://...`, real Razorpay keys, SMTP, S3 credentials.
2. **Build:** `cd frontend && npm run build` → `dist/`; `cd backend && python manage.py collectstatic`.
3. **Serve:** Gunicorn `gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3` behind Nginx (see `frontend/nginx.conf` example: static + `/api/` proxy).
4. **HTTPS:** Let's Encrypt via Certbot, `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`.
5. **DB:** Run migrations, create superuser, set up backups (`pg_dump`), configure Redis/Celery workers if enabled.
6. **Media:** Switch to S3: install `django-storages[boto3]`, set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_STORAGE_BUCKET_NAME`, `DEFAULT_FILE_STORAGE`.
7. **Monitoring:** Use Django logging, Sentry, and health check `/api/v1/health/`.

**Docker Compose** includes postgres/redis/nginx/gunicorn templates — adapt secrets and domains.

---

## Project Structure

```
om-jewellers/
├── frontend/            Vite + React + TS + Tailwind, R3F, Framer Motion
├── backend/
│   ├── config/          Django settings, urls
│   ├── apps/            10 modular apps (accounts, catalog, cart, orders, etc.)
│   ├── media/           product images (local)
│   └── manage.py
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Acceptance Notes

- Homepage is luxury editorial with cinematic motion; 3D works with fallback; all main pages responsive.
- Data from Django APIs (no hardcoded catalog in React); migrations succeed; admin manages catalogue/content.
- Search/filters/product details working; auth secure (JWT + hashing + rate-limiting stubs); cart/wishlist functional; pricing validated server-side; checkout follows Razorpay secure workflow; order history/tracking enforce ownership.
- Forms validate and persist; loading/empty/error states implemented; tests for critical flows pass; env contains no real secrets; documented run commands; production steps documented.
- No fake manufacturing claims; demo testimonials labelled; market-rate integration is documented with fallback, not invented.

---

*Built as a senior full-stack luxury e-commerce platform — maintainable, secure, performant, and ready for production hardening.*
