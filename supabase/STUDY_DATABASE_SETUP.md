# Study database setup (Supabase)

Everything the three dissertation tasks log to is in **`setup_all.sql`**.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project.
2. Wait for the database to finish provisioning.

## 2. Run the schema

1. Supabase Dashboard → **SQL Editor** → New query.
2. Paste the full contents of **`supabase/setup_all.sql`**.
3. Click **Run**.

This creates:

| Table | What it stores |
|-------|----------------|
| `study_task_events` | Task 1–3 completion times (ms) |
| `study_cta_events` | CTA clicks, misclicks, hesitation |
| `study_task_markers` | Researcher verbal-cue timestamps |
| `study_post_order_feedback` | Post-order ratings |
| `study_participant_summary` | View for quick export |

## 3. Connect the frontend

1. Supabase → **Project Settings** → **API**.
2. Copy **Project URL** and **anon public** key.
3. In `frontend/.env`:

```env
VITE_SITE_VERSION=B
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

4. Restart the dev server if it is running.

## 4. Verify

```bash
cd frontend
npm run verify:supabase
```

You should see `OK` for each table. Delete test rows where `participant_id` starts with `verify_` if you like.

## 5. Participant URLs

Open the site with query params so rows are tagged:

```
http://localhost:5173/?participant_id=P001&age_group=65-74
```

For Site A builds, set `VITE_SITE_VERSION=A` before `npm run build`.

## Task timers (what gets logged)

| Task | Starts | Ends | `task_name` |
|------|--------|------|-------------|
| 1 — Navigation | Homepage loads | Restaurant menu loads | `locate_product` |
| 2 — Add to basket | **You press Alt+Shift+2** after verbal cue | Item added to basket | `add_to_basket` |
| 3 — Checkout | **You press Alt+Shift+3** after verbal cue | Order placed successfully | `complete_checkout` |

**Researcher only (nothing shown on screen):**

- **Alt+Shift+2** — start Task 2 timer when you finish reading the Task 2 script.
- **Alt+Shift+3** — start Task 3 timer when you finish reading the Task 3 script (usually on basket or checkout).

Each keypress also logs a row in `study_task_markers` (`marker_type = verbal_start`).

## Export for analysis

Supabase → **Table Editor** → table → **Export CSV**.

Or SQL:

```sql
select * from study_participant_summary order by participant_id;
```

### Columns you will use

- `study_task_events`: `participant_id`, `age_group`, `site_version`, `task_name`, `task_completion_time_ms`
- `study_cta_events`: `task_name`, `cta_button_id`, `hesitation_ms`, `is_misclick`
- `study_post_order_feedback`: ratings after order

## Fallback without Supabase

If keys are missing, events are stored in the browser under `localStorage` key `qb_tracking_log`. Use only for dry runs — not for real participants.

## What I need from you

Only two values in `frontend/.env`:

1. `VITE_SUPABASE_URL`
2. `VITE_SUPABASE_ANON_KEY`

After you add them, run `npm run verify:supabase` and tell me if anything fails.
