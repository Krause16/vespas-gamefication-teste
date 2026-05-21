-- Migration 001: schema inicial VESPAS
-- Cria tabelas salas, jogadores e sessoes_jogos com RLS em todas.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- Tabela: salas
-- ─────────────────────────────────────────────
create table public.salas (
  id        uuid        primary key default gen_random_uuid(),
  codigo    char(6)     not null unique,
  ativa     boolean     not null default true,
  criada_em timestamptz not null default now()
);

alter table public.salas enable row level security;

-- Leitura pública: alunos precisam buscar a sala pelo código
create policy "salas_select_all"
  on public.salas for select
  using (true);

-- Criação e edição restritas ao service_role (instrutor via backend)
create policy "salas_insert_service"
  on public.salas for insert
  with check (auth.role() = 'service_role');

create policy "salas_update_service"
  on public.salas for update
  using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- Tabela: jogadores
-- ─────────────────────────────────────────────
create table public.jogadores (
  id           uuid        primary key default gen_random_uuid(),
  sala_id      uuid        not null references public.salas(id) on delete cascade,
  apelido      text        not null,
  auth_user_id uuid        not null references auth.users(id) on delete cascade,
  entrou_em    timestamptz not null default now()
);

alter table public.jogadores enable row level security;

-- Cada jogador lê e cria apenas o próprio registro
create policy "jogadores_select_own"
  on public.jogadores for select
  using (auth.uid() = auth_user_id);

create policy "jogadores_insert_own"
  on public.jogadores for insert
  with check (auth.uid() = auth_user_id);

-- ─────────────────────────────────────────────
-- Tabela: sessoes_jogos
-- ─────────────────────────────────────────────
create table public.sessoes_jogos (
  id           uuid        primary key default gen_random_uuid(),
  jogador_id   uuid        not null references public.jogadores(id) on delete cascade,
  jogo_slug    text        not null,
  pontuacao    integer     not null default 0,
  iniciada_em  timestamptz not null default now(),
  concluida_em timestamptz
);

alter table public.sessoes_jogos enable row level security;

create policy "sessoes_select_own"
  on public.sessoes_jogos for select
  using (
    exists (
      select 1 from public.jogadores j
      where j.id = jogador_id and j.auth_user_id = auth.uid()
    )
  );

create policy "sessoes_insert_own"
  on public.sessoes_jogos for insert
  with check (
    exists (
      select 1 from public.jogadores j
      where j.id = jogador_id and j.auth_user_id = auth.uid()
    )
  );

create policy "sessoes_update_own"
  on public.sessoes_jogos for update
  using (
    exists (
      select 1 from public.jogadores j
      where j.id = jogador_id and j.auth_user_id = auth.uid()
    )
  );
