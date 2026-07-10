create table if not exists study_task_events (
  id bigint generated always as identity primary key,
  participant_id text not null,
  age_group text not null,
  session_id text not null,
  site_version text not null default 'B',
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
  site_version text not null default 'B',
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

create table if not exists study_popup_events (
  id bigint generated always as identity primary key,
  participant_id text not null,
  age_group text not null,
  session_id text not null,
  site_version text not null default 'B',
  popup_id text not null,
  event_type text not null,
  event_time bigint not null,
  created_at timestamptz default now()
);

create table if not exists study_post_order_feedback (
  id bigint generated always as identity primary key,
  participant_id text not null,
  age_group text not null,
  session_id text not null,
  site_version text not null default 'B',
  order_number text not null,
  smoothness_rating integer not null,
  payment_clarity_rating integer not null,
  feedback_text text default '',
  submitted_at bigint not null,
  created_at timestamptz default now()
);

create table if not exists study_task_markers (
  id bigint generated always as identity primary key,
  participant_id text not null,
  age_group text not null,
  session_id text not null,
  site_version text not null default 'B',
  task_name text not null,
  marker_type text not null,
  marker_time bigint not null,
  created_at timestamptz default now()
);

alter table study_task_events enable row level security;
alter table study_cta_events enable row level security;
alter table study_popup_events enable row level security;
alter table study_post_order_feedback enable row level security;
alter table study_task_markers enable row level security;

drop policy if exists "allow anon insert tasks" on study_task_events;
create policy "allow anon insert tasks"
  on study_task_events for insert to anon with check (true);

drop policy if exists "allow anon insert cta" on study_cta_events;
create policy "allow anon insert cta"
  on study_cta_events for insert to anon with check (true);

drop policy if exists "allow anon insert popups" on study_popup_events;
create policy "allow anon insert popups"
  on study_popup_events for insert to anon with check (true);

drop policy if exists "allow anon insert post order feedback" on study_post_order_feedback;
create policy "allow anon insert post order feedback"
  on study_post_order_feedback for insert to anon with check (true);

drop policy if exists "allow anon insert task markers" on study_task_markers;
create policy "allow anon insert task markers"
  on study_task_markers for insert to anon with check (true);

drop policy if exists "allow authenticated read tasks" on study_task_events;
create policy "allow authenticated read tasks"
  on study_task_events for select to authenticated using (true);

drop policy if exists "allow authenticated read cta" on study_cta_events;
create policy "allow authenticated read cta"
  on study_cta_events for select to authenticated using (true);

drop policy if exists "allow authenticated read popups" on study_popup_events;
create policy "allow authenticated read popups"
  on study_popup_events for select to authenticated using (true);

drop policy if exists "allow authenticated read post order feedback" on study_post_order_feedback;
create policy "allow authenticated read post order feedback"
  on study_post_order_feedback for select to authenticated using (true);

drop policy if exists "allow authenticated read task markers" on study_task_markers;
create policy "allow authenticated read task markers"
  on study_task_markers for select to authenticated using (true);

create index if not exists idx_study_task_participant on study_task_events (participant_id);
create index if not exists idx_study_task_session on study_task_events (session_id);
create index if not exists idx_study_cta_participant on study_cta_events (participant_id);
create index if not exists idx_study_cta_session on study_cta_events (session_id);
create index if not exists idx_study_cta_task on study_cta_events (task_name);

create or replace view study_participant_summary as
select
  t.participant_id,
  t.age_group,
  t.session_id,
  t.site_version,
  max(case when t.task_name = 'locate_product' then t.task_completion_time_ms end) as task1_ms,
  max(case when t.task_name = 'add_to_basket' then t.task_completion_time_ms end) as task2_ms,
  max(case when t.task_name = 'complete_checkout' then t.task_completion_time_ms end) as task3_ms,
  count(distinct c.id) filter (where c.is_misclick = false and c.cta_button_id is not null) as cta_clicks,
  count(distinct c.id) filter (where c.is_misclick = true) as misclicks,
  round(avg(c.hesitation_ms) filter (where c.hesitation_ms is not null)) as avg_hesitation_ms
from study_task_events t
left join study_cta_events c
  on c.session_id = t.session_id and c.participant_id = t.participant_id
group by t.participant_id, t.age_group, t.session_id, t.site_version;

alter table study_task_events add column if not exists site_version text not null default 'B';
alter table study_cta_events add column if not exists task_name text;
alter table study_cta_events add column if not exists site_version text not null default 'B';
alter table study_popup_events add column if not exists site_version text not null default 'B';
alter table study_post_order_feedback add column if not exists site_version text not null default 'B';

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  tracking_public_id uuid not null unique,
  participant_id text not null,
  age_group text not null,
  session_id text not null,
  restaurant_name text not null,
  status text not null default 'confirmed',
  subtotal numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  service_fee numeric(10,2) not null default 0,
  promo_discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  promo_code text not null default '',
  estimated_arrival_label text not null default '8-12 minutes',
  delivery_full_name text not null default '',
  delivery_street text not null default '',
  delivery_city text not null default '',
  delivery_postcode text not null default '',
  delivery_phone text not null default '',
  contact_email text not null default '',
  contact_phone text not null default '',
  card_last_four text not null default '',
  support_phone text not null default '',
  status_updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  product_description text not null default '',
  image_path text not null default '',
  unit_price numeric(10,2) not null,
  quantity integer not null default 1,
  line_total numeric(10,2) not null,
  created_at timestamptz default now()
);

create table if not exists order_notifications (
  id bigint generated always as identity primary key,
  order_id uuid not null references orders(id) on delete cascade,
  channel text not null,
  target text not null default '',
  message_body text not null,
  provider_status text not null default 'queued',
  sent_at timestamptz default now()
);

create table if not exists order_help_requests (
  id bigint generated always as identity primary key,
  order_id uuid not null references orders(id) on delete cascade,
  issue_type text not null,
  message text not null default '',
  created_at timestamptz default now()
);

alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_notifications enable row level security;
alter table order_help_requests enable row level security;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  username text not null unique,
  password_hash text not null,
  created_at timestamptz default now()
);

create index if not exists idx_customers_email on customers (email);
create index if not exists idx_customers_username on customers (username);

alter table customers enable row level security;

create table if not exists customer_profiles (
  customer_id uuid primary key references customers(id) on delete cascade,
  saved_postcode text not null default '',
  delivery_full_name text not null default '',
  delivery_street text not null default '',
  delivery_city text not null default '',
  delivery_postcode text not null default '',
  delivery_phone text not null default '',
  favorite_restaurant_ids jsonb not null default '[]'::jsonb,
  cookie_preferences boolean not null default true,
  cookie_study boolean not null default true,
  updated_at timestamptz default now()
);

create table if not exists support_messages (
  id bigint generated always as identity primary key,
  customer_id uuid references customers(id) on delete set null,
  name text not null default '',
  email text not null default '',
  message text not null default '',
  created_at timestamptz default now()
);

create index if not exists idx_support_messages_customer on support_messages (customer_id);
create index if not exists idx_support_messages_email on support_messages (email);

alter table orders add column if not exists customer_id uuid references customers(id) on delete set null;
create index if not exists idx_orders_customer_id on orders (customer_id);

alter table customer_profiles enable row level security;
alter table support_messages enable row level security;
