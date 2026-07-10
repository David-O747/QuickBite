# QuickBite Backend API

Express backend for real order persistence, status transitions, and notification orchestration.

## What this backend now does

- Creates orders in **Supabase** (`orders`, `order_items`)
- Stores support/help requests (`order_help_requests`)
- Stores notification attempts (`order_notifications`)
- Automatically transitions order status:
  - `confirmed` -> `preparing` -> `on_the_way` -> `delivered`
- Sends notification updates through provider integrations:
  - **SendGrid** for email
  - **Twilio** for SMS
- Falls back to **mocked** notification status when provider keys are missing

## API Endpoints

### `GET /api/health`
Returns server health and Supabase connectivity flag.

### `POST /api/orders`
Creates a persisted order and starts status progression.

### `GET /api/orders/:trackingPublicId`
Returns latest order status by public tracking id.

### `POST /api/orders/:trackingPublicId/help`
Creates a help/support ticket for late/missing orders.

## Local setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Default URL: `http://localhost:3000`

## Environment variables

Use `backend/.env.example` as the source of truth.

Required:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional (for real notifications):
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`

If notification provider keys are missing, the API still works and logs notification rows with `provider_status = mocked`.

## Supabase SQL to run

Run these SQL files in Supabase:

1. `supabase/study_tables.sql` (study analytics tables)
2. `supabase/order_tables.sql` (orders, items, notifications, help requests)