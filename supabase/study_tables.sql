-- QuickBite A/B study tables
-- Prefer running setup_all.sql (includes this + site_version + markers + analysis view)

create table if not exists study_task_events (
  id bigint generated always as identity primary key,
  participant_id text not null,
  age_group text not null,
  session_id text not null,
  task_name text not null,
  task_start_time bigint not null,
  task_end_time bigint not null,
  task_completion_time_ms bigint not null,
  created_at timestamptz default now()
);

create table if not exists study_cta_events (
  id bigint generated always as identity primary key,
  participant_id text not null,
  age_group text not null,
  session_id text not null,
  task_name text,
  cta_button_id text,
  click_x integer,
  click_y integer,
  hover_start_time bigint,
  click_time bigint not null,
  hesitation_ms bigint,
  is_misclick boolean default false,
  created_at timestamptz default now()
);

-- allow anon insert for silent client-side logging
alter table study_task_events enable row level security;
alter table study_cta_events enable row level security;

create policy "allow anon insert tasks"
  on study_task_events for insert
  to anon
  with check (true);

create policy "allow anon insert cta"
  on study_cta_events for insert
  to anon
  with check (true);

-- optional: allow authenticated read for researcher export
create policy "allow authenticated read tasks"
  on study_task_events for select
  to authenticated
  using (true);

create policy "allow authenticated read cta"
  on study_cta_events for select
  to authenticated
  using (true);

create table if not exists study_popup_events (
  id bigint generated always as identity primary key,
  participant_id text not null,
  age_group text not null,
  session_id text not null,
  popup_id text not null,
  event_type text not null,
  event_time bigint not null,
  created_at timestamptz default now()
);

alter table study_popup_events enable row level security;

create policy "allow anon insert popups"
  on study_popup_events for insert
  to anon
  with check (true);

create policy "allow authenticated read popups"
  on study_popup_events for select
  to authenticated
  using (true);

create table if not exists study_post_order_feedback (
  id bigint generated always as identity primary key,
  participant_id text not null,
  age_group text not null,
  session_id text not null,
  order_number text not null,
  smoothness_rating integer not null,
  payment_clarity_rating integer not null,
  feedback_text text default '',
  submitted_at bigint not null,
  created_at timestamptz default now()
);

alter table study_post_order_feedback enable row level security;

create policy "allow anon insert post order feedback"
  on study_post_order_feedback for insert
  to anon
  with check (true);

create policy "allow authenticated read post order feedback"
  on study_post_order_feedback for select
  to authenticated
  using (true);

-- If tables already exist, run once in SQL editor:
-- alter table study_cta_events add column if not exists task_name text;
