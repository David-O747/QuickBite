# QuickBite

QuickBite is a food-ordering web app built for a usability study comparing two site versions. Participants browse restaurants, build a basket, check out, and track their order. Version **B** includes micro-interactions; version **A** is the same layout and flow without those effects.

## Repository and live links

| Resource | URL |
|----------|-----|
| **GitHub** | https://github.com/David-O747/QuickBite |
| **Version B** (micro-interactions on) | https://quickestbites.netlify.app |
| **Version A** (micro-interactions off) | https://quickbites2.netlify.app |
| **API (Render)** | https://quickbite-35e2.onrender.com |

## Live study / testing links

Use these URL formats during testing. Replace the participant ID and age group for each session.

**Age groups used in the study:** `18-25` and `65+`

### Version B — https://quickestbites.netlify.app

```
https://quickestbites.netlify.app/?participant_id=P001&age_group=65+
https://quickestbites.netlify.app/?participant_id=P016&age_group=18-25
```

### Version A — https://quickbites2.netlify.app

```
https://quickbites2.netlify.app/?participant_id=P011&age_group=65+
https://quickbites2.netlify.app/?participant_id=P006&age_group=18-25
```

### General template

```
https://quickestbites.netlify.app/?participant_id=P00X&age_group=18-25
https://quickbites2.netlify.app/?participant_id=P00X&age_group=65+
```

If the API has been idle, open https://quickbite-35e2.onrender.com/api/health first and wait for `"status":"ok"`.

## Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** Supabase (Postgres)

## Getting started

### 1. Database

Run the full schema in the Supabase SQL editor:

```
supabase/setup_all.sql
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=3000
NODE_ENV=development
FRONTEND_ORIGIN=http://127.0.0.1:5173,http://localhost:5173
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Optional (email/SMS notifications; without these, messages are logged only):

```
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
```

Start the API:

```bash
npm start
```

Runs on `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_SITE_VERSION=B
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://127.0.0.1:3000
```

Start the app:

```bash
npm run dev
```

Opens on `http://localhost:5173`.

## Site versions

Set `VITE_SITE_VERSION` in `frontend/.env` (and on each Netlify site):

| Value | Behaviour |
|-------|-----------|
| `B` | Micro-interactions enabled (default for the study) |
| `A` | Same UI, micro-interactions turned off |

Rebuild or restart the dev server after changing this value.

## Participant link

Send participants a URL with their ID and age group.

**Live (preferred for the study):** see [Live study / testing links](#live-study--testing-links) above.

**Local development:**

```
http://localhost:5173/?participant_id=P001&age_group=65+
```

If `participant_id` is missing, the app still works but logs the participant as `anonymous`.

## Study tasks

Three timed tasks are recorded in Supabase (`study_task_events`):

| Task | Name | When the timer starts | When it ends |
|------|------|----------------------|--------------|
| 1 | Locate a product | Home page loads (with `participant_id` in the URL) | Restaurant menu page loads |
| 2 | Add to basket | Restaurant menu page loads | First item successfully added to basket |
| 3 | Complete checkout | Basket page loads | Order confirmation page loads |

Each task row stores: `participant_id`, `age_group`, `session_id`, `site_version` (`A` or `B`), `task_name`, `task_start_time`, `task_end_time`, `task_completion_time_ms` (number), and `created_at` (timestamp).

CTA clicks and misclicks are stored in `study_cta_events` with `cta_button_id`, `hesitation_ms`, `is_misclick`, click coordinates, and the same participant/session/version fields.

**Alt+Shift+2** and **Alt+Shift+3** only write verbal-start markers to `study_task_markers` (they do not restart the timers).

## Micro-interactions (version B only)

On version A, content and buttons behave the same but without the animations and transitions below.

| # | Effect | Where |
|---|--------|-------|
| 1 | Button hover scale, shadow, and press feedback | Primary buttons across the site (`CtaButton`) |
| 2 | Spinning loader | Home, restaurant menu, checkout, register, login, delivery areas |
| 3 | Success message fade-in | Register, login, order confirmation |
| 4 | Input focus border highlight | Forms (register, login, checkout, help centre, delivery areas) |
| 5 | Green/red field borders and valid tick | Form fields after the user has typed |
| 6 | Password rules checklist while focused | Register page |
| 7 | Checkout step dots and lines animate | Basket → checkout → confirmation |
| 8 | Basket count pulse in the header | After adding an item from a restaurant menu |
| 9 | “Item added to your basket” fade-in | Restaurant menu, under the add button |
| 10 | Order confirmed check icon fade-in | Order confirmation page |
| 11 | Delivery map spinner / courier pulse | Order confirmation live track (version B only) |

## Main features

**Home**
- Search by address or UK postcode (OpenStreetMap geocoding)
- Category filters and restaurant cards
- Favourites (saved per logged-in account)

**Restaurant menu**
- Sections: Popular, Mains, Sides, Beverages, Desserts
- Add to basket with restaurant conflict popup if the basket already has items from elsewhere

**Basket & checkout**
- Quantity controls, promo code field
- Delivery details with inline validation
- Card-style payment step (demo — full card numbers are not stored)
- Orders saved to Supabase via the backend API

**Account** (`/account`)
- Active and past orders
- Get Help links per order
- Profile data synced from Supabase (address, favourites, cookie prefs)

**Help centre** (`/info/help-centre`)
- Contact form; messages stored in `support_messages`

**Order confirmation**
- Delivery timeline (Confirmed → Preparing → On the way → Delivered) with timed stages
- Post-order feedback questionnaire when the order reaches Delivered
- Live track view and help options

**Auth**
- Register and login against the `customers` table
- Passwords hashed on the server

**Cookies** (`/info/cookie-policy`)
- Preference toggles saved to the user profile when logged in

## What gets stored

| Data | Storage |
|------|---------|
| Task times, button clicks, popups, feedback | Supabase study tables |
| Orders and items | Supabase `orders`, `order_items` |
| Accounts | Supabase `customers` |
| Saved address, favourites, cookies | Supabase `customer_profiles` |
| Help messages | Supabase `support_messages` |
| Basket (before checkout) | Browser memory only |

## Deployment

- **Frontend:** Netlify (`netlify.toml` — build from `frontend/`, publish `dist/`)
  - Version A: https://quickbites2.netlify.app
  - Version B: https://quickestbites.netlify.app
- **Backend:** Render (`render.yaml` — Node service in `backend/`)
- **Source:** https://github.com/David-O747/QuickBite

Set the same environment variables on each host. Point `VITE_API_URL` at the live API URL and add both Netlify origins to `FRONTEND_ORIGIN` on the backend.

## Project structure

```
backend/          Express API (auth, orders, profile, support, study events)
frontend/         React app
exports/          Cleaned study data and analysis workbooks
supabase/         setup_all.sql — full database schema
netlify.toml      Frontend hosting config
render.yaml       Backend hosting config
```
