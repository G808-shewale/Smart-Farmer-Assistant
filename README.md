# 🌾 Smart Farmer Assistant (स्मार्ट शेतकरी सहाय्यक / स्मार्ट किसान सहायक)

> **Empowering Indian Smallholder Farmers with AI Decision Support, Secure Financial Tracking, Smart Irrigation, and Market Intelligence.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg?style=flat&logo=python&logoColor=white)](https://www.python.org)
[![Security](https://img.shields.io/badge/Security-Argon2id%20%7C%20Tenant%20Isolation-darkgreen.svg?style=flat)](https://github.com)
[![Languages](https://img.shields.io/badge/Languages-English%20%7C%20मराठी%20%7C%20हिंदी-orange.svg?style=flat)](https://github.com)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel%20Ready-black.svg?style=flat&logo=vercel)](https://vercel.com)

---

## 📖 Overview

The **Smart Farmer Assistant** is a unified, resilient agricultural management platform designed specifically for individual farmers in Maharashtra and across India. It bridges critical information gaps by combining:
1. **Soil- and climate-aware agronomic advisory** from credible ICAR, MPKV Rahuri, and VNMKV Parbhani university research.
2. **Weather-aware irrigation scheduling** that alerts farmers before unseasonal rainfall to prevent water wastage and root rot.
3. **Mandi market intelligence** based on Agmarknet APMC benchmarks and authentic Government of India Minimum Support Prices (MSP) for 2026–27.
4. **Tenant-isolated financial and farm task calendars** secured with military-grade **Argon2id** encryption.

The application works completely offline with cached fallback data, and synchronizes securely with the FastAPI backend when connected.

---

## ✨ Core Features & Modules

### 1. 📊 Farm Dashboard & Financial Overview
- Real-time KPI summaries: Total Income, Total Expenses, Net Profit/Loss, Active Crops, and Pending Farm Tasks.
- Instant overview of the recent 3 transactions with visual status badges.
- Quick shortcut actions for logging expenses, recording watering, and scheduling sprays.

### 2. 💰 Expense & Income Tracker
- Dedicated categorization for seeds, fertilizers, pesticides, diesel/electricity, labor, equipment hire, and harvest sales.
- Automatic computation of net farm profitability per season.
- Strict multi-tenant isolation: farmers can view and manage only their own financial logs.

### 3. 🧠 Smart Crop Advisor & Comparison Tool
- Agronomic recommendations based on soil type (Black Cotton/Regur, Loamy, Red, Sandy Loam), water availability, and season (Kharif, Rabi, Zaid).
- Backed by credible references from MPKV Rahuri and VNMKV Parbhani.
- Side-by-side comparison tool contrasting water requirements, duration, soil suitability, and agronomic risks for two crops simultaneously.

### 4. 💧 Smart Weather-Aware Irrigation Scheduler
- Open-Meteo precipitation forecast integration.
- Automatic warning when forecasted rainfall exceeds 10 mm over the next 48 hours to avoid over-irrigation.
- Dedicated logging for water volume (liters/hours), irrigation method (Drip, Sprinkler, Flood), and crop growth stage.

### 5. 🌦️ Hyperlocal Weather & 48-Hour Rainfall Forecast
- Temperature, relative humidity, wind speed, and precipitation alerts for key Maharashtra agricultural districts (Nashik, Pune, Ahmednagar, Solapur, Kolhapur, etc.).

### 6. 📅 Farm Tasks & Reminders Calendar
- Interactive 7-day strip calendar for agricultural operations (sowing, spraying, weeding, fertilizer application, harvesting).
- Priority tagging (Urgent, High, Medium, Low) and single-click task completion toggling.
- Duplicate-safe task submission and offline synchronization.

### 7. 📈 APMC Mandi Market Prices & Selling Advisor
- Modal prices, minimum/maximum price spreads, and weekly trends from major Maharashtra mandis (Nashik, Pune, Lasalgaon, Solapur, Ahmednagar).
- Authentic 2026–27 Government of India Minimum Support Prices (MSP):
  - **Soybean (Yellow):** ₹5,708 / quintal
  - **Cotton (Medium Staple):** ₹8,267 / quintal
  - **Wheat:** ₹2,585 / quintal
  - **Chana (Gram):** ₹5,875 / quintal
  - **Onion:** Market-driven (Horticultural benchmark)
- Algorithmic Selling Advisor (SELL, HOLD, WATCH) factoring price momentum, MSP floor comparison, and storage risk.

### 8. 📚 Crop Encyclopedia
- Comprehensive agronomic guides for Soybean, Cotton, Onion, Wheat, Sugarcane, Chana, Pomegranate, and Grapes.
- Information on recommended seed varieties, critical irrigation stages, and pest control.

### 9. 🌐 Native Trilingual Support
- Instant, seamless switching across **मराठी (Marathi)**, **हिंदी (Hindi)**, and **English** with 100% key parity across all 9 modules.

---

## 🔒 Security & Architecture (Phase 6 Patch)

- **Argon2id Password Hashing:** Passwords are never stored in plaintext. Passwords are hashed with salted Argon2id using memory-hard parameters.
- **Stateful 24-Hour Session Tokens:** Authenticated session tokens are verified on every private endpoint and immediately revoked on logout.
- **Tenant Isolation:** Client-submitted `farmer_id` is never trusted. The authenticated farmer profile is derived strictly from the verified Bearer session token.
- **Directory Protection:** Legacy `GET /api/farmers` directory listing is restricted to administrators (HTTP 403 Forbidden). Unauthenticated calls are blocked (HTTP 401 Unauthorized).
- **Profile Deletion Authorization:** Farmers can strictly delete only their own profile. Unauthorized deletion returns HTTP 403 Forbidden.
- **Demonstration Endpoint Protection:** Seed endpoints (`/api/transactions/seed-demo`, `/api/tasks/seed-demo`) require an active session token and seed records scoped strictly to the authenticated user.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla JavaScript (ES6+), Modern Semantic HTML5, Responsive CSS3 |
| **Backend API** | FastAPI 0.110+, Pydantic v2, Uvicorn ASGI server |
| **Database** | SQLite 3 with SQLAlchemy 2.0 ORM |
| **Authentication** | Argon2id (`argon2-cffi`), Bearer Session Tokens |
| **External APIs** | Open-Meteo Weather API, Agmarknet Market Benchmarks |
| **Deployment** | Vercel Serverless Functions (`@vercel/python` + `@vercel/static`), Render, Railway, or Local |

---

## 🚀 Quickstart (Local Development)

### Prerequisites
- Python 3.10+ installed
- Modern web browser (Chrome, Edge, Firefox, Safari)

### 1. Clone or Open the Repository
```bash
cd "my first project"
```

### 2. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 3. Start the FastAPI Backend Server
Run the ASGI server from the project root:
```bash
python -m uvicorn backend.main:app --reload --port 8000
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger API Docs: `http://127.0.0.1:8000/docs`
- Alternative ReDoc: `http://127.0.0.1:8000/redoc`

### 4. Start the Frontend Web Server
In a separate terminal window, run:
```bash
python -m http.server 8080
```
- Open in your browser: **[http://localhost:8080/index.html](http://localhost:8080/index.html)**

---

## ⚡ Demo Account & Quick Testing

For immediate testing, use the pre-configured demo account:
- **Username:** `suresh9876` *(or 10-digit mobile: `9876543210`)*
- **Password:** `Farmer@123`

> **Tip:** You can also click the **⚡ Fill** button inside the Login modal to autofill demo credentials with a single click.

To test new account registration:
1. Click **Farmer Login** in the top navigation bar.
2. Select the **नवीन नोंदणी / New Registration** tab.
3. Enter a unique username (e.g. `patil_farm_2026`), password (min. 6 characters), and farm details.
4. Click **Create Farmer Account**. You will be logged in immediately with an active session token.

---

## ☁️ Deploying on Vercel

The project is pre-configured for 1-click deployment on **Vercel** with both the FastAPI backend (as serverless functions) and static frontend assets.

### Method 1: Using the Vercel CLI (Recommended)
1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Run `vercel` from the project root:
   ```bash
   vercel
   ```
3. Follow the on-screen prompts:
   - Link to existing project? **No**
   - Project name? **smart-farmer-assistant**
   - Directory located? **./**
   - Want to modify settings? **No**
4. Deploy to production:
   ```bash
   vercel --prod
   ```

### Method 2: Via GitHub / Vercel Dashboard
1. Push your repository to GitHub (or GitLab/Bitbucket).
2. Log in to [vercel.com](https://vercel.com) and click **Add New... -> Project**.
3. Import your repository.
4. Vercel automatically detects `vercel.json`, `api/index.py`, and `requirements.txt`.
5. Click **Deploy**.

> **Note on Vercel Serverless Storage:**
> In Vercel serverless environments, files in the root deployment are read-only. `backend/database.py` automatically detects the Vercel runtime (`VERCEL=1`) and creates an ephemeral, writable database copy at `/tmp/smart_farmer.db`.
> For permanent, multi-region persistence in production, connect a hosted PostgreSQL instance (e.g., Supabase, Neon) by setting the `DATABASE_URL` environment variable in the Vercel Project Settings.

---

## 🧪 Automated Test Suite

The test suite runs 54 automated regression tests against an **isolated test database** (`test_smart_farmer_isolated.db`), ensuring zero data drift or pollution in the live database:

```bash
python backend/test_api.py
```

### Test Coverage Highlights:
- **Tests 1–11:** Health check, profile creation, transactions, Pydantic validation, financial summary, demo seeding.
- **Tests 12–18:** Smart irrigation log CRUD, duration validation, date format checks.
- **Tests 19–22:** Crop name filtering, cross-farmer read/write blocks (403), duplicate-safe offline synchronization.
- **Tests 23–30:** Farm task calendar, category filtering, completion toggling, duplicate prevention.
- **Tests 31–42:** APMC mandi prices, price spread validation, historical trend chronometry, MSP accuracy, and cautious advice on missing data.
- **Tests 43–50:** Argon2id registration, duplicate prevention (409), session expiry, token revocation on logout.
- **Tests 51–54 (Security Patch):** Farmer directory enumeration prevention (401/403), cross-farmer profile protection (403), ownership verification on deletion, and protected seed demo endpoints.

---

## ⚠️ Known Limitations & Notes

1. **Local SQLite Ephemerality on Serverless:** Local SQLite is ideal for desktop and standalone server environments. On serverless platforms like Vercel, serverless instances are stateless and ephemeral; for permanent data persistence across cold starts, configure a managed PostgreSQL database via `DATABASE_URL`.
2. **External Forecast Availability:** Hyperlocal weather and rainfall alerts use the Open-Meteo public API. When offline, the app transparently serves cached forecast data without throwing blocking errors.

---

## 📄 License & Attribution

- Built with ❤️ for Indian Farmers.
- Agronomic data based on published guidelines from **Indian Council of Agricultural Research (ICAR)**, **MPKV Rahuri**, and **VNMKV Parbhani**.
- Market prices benchmarked with **Agmarknet (agmarknet.gov.in)** and **MSAMB Pune**.
