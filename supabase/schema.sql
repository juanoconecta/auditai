-- Tabla de auditorías
create table if not exists public.auditorias (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  perfil text not null,
  red_social text not null,
  score_general integer not null,
  nivel_general text not null,
  informe jsonb not null,
  created_at timestamptz default now() not null
);

-- RLS: cada usuario solo ve sus propias auditorías
alter table public.auditorias enable row level security;

create policy "Users can read own auditorias"
  on public.auditorias for select
  using (auth.uid() = user_id);

create policy "Users can insert own auditorias"
  on public.auditorias for insert
  with check (auth.uid() = user_id);

-- Índice para listar por usuario ordenado por fecha
create index auditorias_user_id_created_at_idx on public.auditorias(user_id, created_at desc);

-- Tabla de pagos (plan "Por informe" vía Mercado Pago Checkout Pro)
create table if not exists public.pagos (
  id uuid default gen_random_uuid() primary key,
  external_reference uuid default gen_random_uuid() not null unique,
  user_id uuid references auth.users(id) on delete set null,
  perfil text not null,
  form_data jsonb not null,
  status text not null default 'pending',
  mp_payment_id text,
  used boolean not null default false,
  created_at timestamptz default now() not null
);

-- RLS: acceso vía external_reference (token aleatorio), no hay sesión de usuario
-- en el flujo de pago ni en el webhook de Mercado Pago.
alter table public.pagos enable row level security;

create policy "Anyone can insert pagos"
  on public.pagos for insert
  with check (true);

create policy "Anyone can read pagos"
  on public.pagos for select
  using (true);

create policy "Anyone can update pagos"
  on public.pagos for update
  using (true);

create index pagos_external_reference_idx on public.pagos(external_reference);

-- Tabla de suscripciones (plan "Pro" recurrente vía Mercado Pago Suscripciones)
create table if not exists public.suscripciones (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  external_reference uuid default gen_random_uuid() not null unique,
  mp_preapproval_id text,
  status text not null default 'pending',
  created_at timestamptz default now() not null
);

alter table public.suscripciones enable row level security;

create policy "Users can read own suscripciones"
  on public.suscripciones for select
  using (auth.uid() = user_id);

create policy "Users can insert own suscripciones"
  on public.suscripciones for insert
  with check (auth.uid() = user_id);

-- El webhook de Mercado Pago no tiene sesión de usuario
create policy "Anyone can update suscripciones"
  on public.suscripciones for update
  using (true);

create index suscripciones_user_id_idx on public.suscripciones(user_id);
create index suscripciones_external_reference_idx on public.suscripciones(external_reference);
