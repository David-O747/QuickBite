-- QuickBite order backend tables
-- Run once in Supabase SQL editor

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
  channel text not null, -- email | sms
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

-- backend service_role handles writes/reads; frontend consumes order state through backend API
create policy "backend only read orders"
  on orders for select
  to authenticated
  using (false);

create policy "backend only read order_items"
  on order_items for select
  to authenticated
  using (false);

create policy "backend only read order_notifications"
  on order_notifications for select
  to authenticated
  using (false);

create policy "backend only read help requests"
  on order_help_requests for select
  to authenticated
  using (false);
