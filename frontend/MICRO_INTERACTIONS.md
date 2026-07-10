# Micro-interactions Required (Yes + Where)

Yes — these are implemented.

## 1. Which Micro-interactions Must Be in Your Website Based on Your Papers

Only these 10 — all justified by Boyd & Bond (2021), with Sweller (1988) providing theoretical grounding:

| # | Micro-interaction | Yes | Location |
|---|-------------------|-----|----------|
| 1 | Click confirmation | Yes | Every CTA button sitewide |
| 2 | Hover state transition | Yes | Every CTA button sitewide |
| 3 | Loading indicator | Yes | Every async action sitewide |
| 4 | Success message | Yes | After login, registration, order placed |
| 5 | Item added animation | Yes | Add to basket button |
| 6 | Progress indicator | Yes | Checkout flow only |
| 7 | Active state border highlight | Yes | All form fields |
| 8 | Inline field validation | Yes | Email, username, postcode, required fields |
| 9 | Password strength indicator | Yes | Register form only |
| 10 | Basket inline confirmation | Yes | Brief "Item added" text after add action |

## 2. Dissertation metrics (what gets logged)

| Metric | How it is measured on Site B | Supabase table / field |
|--------|------------------------------|-------------------------|
| Task-completion time | `startTaskTimer` → `endTaskTimer` per task | `study_task_events.task_completion_time_ms` |
| CTA click rate | Every tracked CTA click (`CtaButton` + `data-cta-id`) | `study_cta_events` where `is_misclick = false` |
| Misclick count | Document clicks outside any `[data-cta-id]` | `study_cta_events` where `is_misclick = true` |
| Hesitation time | `mouseenter` on CTA → click (Site B only; hover MI must be on) | `study_cta_events.hesitation_ms` |

**Tasks timed:** `locate_product` (home → menu), `add_to_basket` (menu → add item), `complete_checkout` (basket → place order).

## 4. Canonical study path (no alternate routes)

Participants follow **one linear journey** so task times are comparable:

1. **Task 1 — Locate product:** Home (`/`) → open a restaurant menu  
2. **Task 2 — Add to basket:** Restaurant menu → tap **Add to Basket** (timer ends on successful add)  
3. **Auto-redirect to basket** (~1.2s after add, so “item added” feedback can show)  
4. **Task 3 — Complete checkout:** Basket → **Proceed to Checkout** → place order → confirmation  

**Removed to prevent bias:** header basket icon navigation, menu “View basket” bar, basket “back to menu”, browse/product pages (redirect to home), “You may also like” upsells on basket.

**Site A vs B:** Set `VITE_SITE_VERSION=A` (no hover/click MI, no hesitation timing) or `B` (all 10 MIs on). CTA and misclick logging runs on both versions.

## 3. Study popups (disabled during data collection)

Cookie banner and informational popups (delivery saved, account overview, guest checkout, payment info, order policy) are **removed** so they cannot slow participants or bias task times. Post-order **feedback modals** on the confirmation page remain — they appear only after checkout completes, with no animation on either site.
