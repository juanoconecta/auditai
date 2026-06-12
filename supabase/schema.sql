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
