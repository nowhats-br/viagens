-- Habilita a extensão pgcrypto para gerar UUIDs
create extension if not exists "uuid-ossp" with schema "extensions";

-- Tabela para armazenar as configurações do admin
create table if not exists public.settings (
  id int primary key default 1,
  logo_url text not null default 'https://i.ibb.co/Stx3pW7/logo-comadesma-gold.png',
  whatsapp_number text not null default '5562999999999',
  reservation_timeout_hours int not null default 24,
  updated_at timestamptz default now(),
  constraint single_row_check check (id = 1)
);

-- Tabela para armazenar os detalhes da excursão (mesmo que seja só uma)
create table if not exists public.excursions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  origin text not null,
  destination text not null,
  departure_date timestamptz not null,
  return_date timestamptz not null,
  distance_km int,
  duration_hours int
);

-- Tabela para armazenar os assentos
create table if not exists public.seats (
  id uuid primary key default uuid_generate_v4(),
  excursion_id uuid references public.excursions(id) on delete cascade,
  seat_number int not null,
  type text not null, -- 'leito' ou 'semi-leito'
  floor text not null, -- 'inferior' ou 'superior'
  price numeric(10, 2) not null,
  status text not null default 'available', -- 'available', 'reserved', 'occupied'
  unique(excursion_id, seat_number)
);

-- Tabela para armazenar os dados dos passageiros
create table if not exists public.passengers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  cpf text not null unique,
  email text not null,
  phone text not null,
  birth_date date not null,
  created_at timestamptz default now()
);

-- Tabela para armazenar as reservas
create table if not exists public.reservations (
  id uuid primary key default uuid_generate_v4(),
  passenger_id uuid references public.passengers(id) on delete set null,
  excursion_id uuid references public.excursions(id) on delete cascade,
  status text not null default 'pending', -- 'pending', 'confirmed', 'expired'
  payment_method text,
  installments int,
  total_price numeric(10, 2) not null,
  created_at timestamptz default now(),
  expires_at timestamptz
);

-- Tabela de junção para conectar reservas a múltiplos assentos
create table if not exists public.reservation_seats (
  reservation_id uuid references public.reservations(id) on delete cascade,
  seat_id uuid references public.seats(id) on delete cascade,
  primary key (reservation_id, seat_id)
);

-- Inserir dados iniciais
begin;

-- Limpar tabelas antes de inserir para garantir um estado limpo
delete from public.settings;
delete from public.reservation_seats;
delete from public.reservations;
delete from public.passengers;
delete from public.seats;
delete from public.excursions;

-- Inserir configurações padrão
insert into public.settings (id, logo_url, whatsapp_number, reservation_timeout_hours)
values (1, 'https://i.ibb.co/Stx3pW7/logo-comadesma-gold.png', '5562999999999', 24);

-- Inserir a excursão principal
insert into public.excursions (id, name, origin, destination, departure_date, return_date, distance_km, duration_hours)
values ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Convenção Comadesma 2026', 'Goiânia, GO', 'Açailândia, MA', '2026-01-06 22:00:00-03', '2026-01-10 22:00:00-03', 1470, 22)
returning id;

-- Inserir os assentos
do $$
declare
  excursion_uuid uuid := 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
begin
  -- 12 assentos leito (andar inferior)
  for i in 1..12 loop
    insert into public.seats (excursion_id, seat_number, type, floor, price)
    values (excursion_uuid, i, 'leito', 'inferior', 950.00);
  end loop;
  
  -- 44 assentos semi-leito (andar superior)
  for i in 1..44 loop
    insert into public.seats (excursion_id, seat_number, type, floor, price)
    values (excursion_uuid, i + 12, 'semi-leito', 'superior', 800.00);
  end loop;
end $$;

commit;

-- Políticas de Segurança (Row Level Security)
-- Habilitar RLS para todas as tabelas
alter table public.settings enable row level security;
alter table public.excursions enable row level security;
alter table public.seats enable row level security;
alter table public.passengers enable row level security;
alter table public.reservations enable row level security;
alter table public.reservation_seats enable row level security;

-- Permitir leitura pública em tabelas não sensíveis
create policy "Allow public read access on settings" on public.settings for select using (true);
create policy "Allow public read access on excursions" on public.excursions for select using (true);
create policy "Allow public read access on seats" on public.seats for select using (true);

-- Permitir que qualquer pessoa crie passageiros e reservas (será restrito com autenticação no futuro)
create policy "Allow anyone to create passengers" on public.passengers for insert with check (true);
create policy "Allow anyone to create reservations" on public.reservations for insert with check (true);
create policy "Allow anyone to link seats to reservations" on public.reservation_seats for insert with check (true);

-- Permitir que qualquer pessoa leia passageiros e reservas (temporário, para o app funcionar sem auth)
create policy "Allow public read access on passengers" on public.passengers for select using (true);
create policy "Allow public read access on reservations" on public.reservations for select using (true);
create policy "Allow public read access on reservation_seats" on public.reservation_seats for select using (true);

-- Permitir que qualquer pessoa atualize o status dos assentos e reservas (temporário)
create policy "Allow anyone to update seats" on public.seats for update using (true) with check (true);
create policy "Allow anyone to update reservations" on public.reservations for update using (true) with check (true);
