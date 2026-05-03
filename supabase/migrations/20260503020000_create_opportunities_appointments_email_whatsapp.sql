create extension if not exists pgcrypto;

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  status text not null default 'new',
  prospect_name text not null,
  prospect_email text not null,
  prospect_phone text,
  company text,
  service_interest text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.opportunities(id) on delete set null,
  status text not null default 'pending',
  prospect_name text not null,
  prospect_email text not null,
  prospect_phone text,
  company text,
  start_at timestamptz,
  end_at timestamptz,
  notes text,
  google_event_id text,
  google_event_link text,
  google_meet_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  whatsapp_user_id text not null unique,
  phone text not null,
  profile_name text,
  state text not null default 'new',
  status text not null default 'open',
  collected_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.opportunities(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  whatsapp_conversation_id uuid references public.whatsapp_conversations(id) on delete set null,
  recipient text not null,
  subject text not null,
  template text not null,
  status text not null,
  provider_message_id text,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.whatsapp_conversations(id) on delete cascade,
  provider_message_id text unique,
  direction text not null,
  from_phone text,
  to_phone text,
  body text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists opportunities_created_at_idx on public.opportunities(created_at desc);
create index if not exists appointments_start_at_idx on public.appointments(start_at);
create index if not exists email_events_created_at_idx on public.email_events(created_at desc);
create index if not exists whatsapp_messages_conversation_created_idx on public.whatsapp_messages(conversation_id, created_at);

alter table public.opportunities enable row level security;
alter table public.appointments enable row level security;
alter table public.email_events enable row level security;
alter table public.whatsapp_conversations enable row level security;
alter table public.whatsapp_messages enable row level security;
