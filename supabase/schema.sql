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
