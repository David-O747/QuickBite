# QuickBite

QuickBite is a food-ordering web app built for a usability study comparing two site versions. Participants browse restaurants, build a basket, check out, and track their order. Version **B** includes micro-interactions; version **A** is the same layout and flow without those effects.

## Live study links

| Version | Micro-interactions | Live URL |
|---------|--------------------|----------|
| **B** | On | https://quickestbites.netlify.app |
| **A** | Off | https://quickbites2.netlify.app |

**API (Render):** https://quickbite-35e2.onrender.com

Participant example links:

```
https://quickestbites.netlify.app/?participant_id=P001&age_group=65-74
https://quickbites2.netlify.app/?participant_id=P001&age_group=65-74
```

Replace `P001` and `65-74` per session. If the API has been idle, open https://quickbite-35e2.onrender.com/api/health first and wait for `"status":"ok"`.

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
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
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

Set `VITE_SITE_VERSION` in `frontend/.env`:

| Value | Behaviour |
|-------|-----------|
| `B` | Micro-interactions enabled (default for the study) |
| `A` | Same UI, micro-interactions turned off |

Rebuild or restart the dev server after changing this value.

## Participant link

Send participants a URL with their ID and age group.

**Live (preferred for the study):**

```
https://quickestbites.netlify.app/?participant_id=P001&age_group=65-74
https://quickbites2.netlify.app/?participant_id=P001&age_group=65-74
```

**Local development:**

```
http://localhost:5173/?participant_id=P001&age_group=65-74
```

Replace `P001` and `65-74` per session. If these are missing, the app still works but logs the participant as `anonymous`.

## Study tasks

Three timed tasks are recorded in Supabase:

| Task | Name | When the timer starts | When it ends |
|------|------|----------------------|--------------|
| 1 | Locate a product | Home page loads | User opens a restaurant menu |
| 2 | Add to basket | Researcher presses **Alt+Shift+2**, or first item is added | First item added to basket |
| 3 | Complete checkout | Researcher presses **Alt+Shift+3**, or user reaches checkout | Order placed |

**Alt+Shift+2** and **Alt+Shift+3** are for the researcher to mark when they give the verbal task instruction.

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

Courier map pulse on the “On the way” step runs on both versions.

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
- Post-order feedback popup appears 5 seconds after placing an order (star ratings + optional text)
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
- **Backend:** Render (`render.yaml` — Node service in `backend/`)

Set the same environment variables on each host. Point `VITE_API_URL` at the live API URL and add that origin to `FRONTEND_ORIGIN` on the backend.

## Project structure

```
backend/          Express API (auth, orders, profile, support)
frontend/         React app
supabase/         setup_all.sql — full database schema
netlify.toml      Frontend hosting config
render.yaml       Backend hosting config
```
