-- Migration 003: sistema de gincana
-- Adiciona equipe + pontuacao_total em jogadores, cria eventos_sala,
-- ranking_sala view e função incrementar_pontuacao.

-- ─────────────────────────────────────────────
-- Step 1: Colunas extras em jogadores
-- ─────────────────────────────────────────────
alter table public.jogadores
  add column if not exists equipe         text,
  add column if not exists pontuacao_total integer not null default 0;

-- ─────────────────────────────────────────────
-- Step 2: RLS revisada em jogadores
-- Leitura pública: alunos e instrutor precisam ver o ranking
-- ─────────────────────────────────────────────
drop policy if exists "jogadores_select_own"            on public.jogadores;
drop policy if exists "jogadores_select_authenticated"  on public.jogadores;
drop policy if exists "jogadores_select_public"         on public.jogadores;
drop policy if exists "jogadores_update_own"            on public.jogadores;

create policy "jogadores_select_public"
  on public.jogadores for select
  using (true);

create policy "jogadores_update_own"
  on public.jogadores for update
  using (auth.uid() = auth_user_id);

-- ─────────────────────────────────────────────
-- Step 3: salas — permitir UPDATE para qualquer um (MVP: código = auth)
-- ─────────────────────────────────────────────
drop policy if exists "salas_update_service" on public.salas;
drop policy if exists "salas_update_public"  on public.salas;

create policy "salas_update_public"
  on public.salas for update
  using (true);

-- ─────────────────────────────────────────────
-- Step 4: Função atômica de incremento de pontuação
-- SECURITY DEFINER: opera como owner, ignora RLS
-- ─────────────────────────────────────────────
create or replace function public.incrementar_pontuacao(
  p_jogador_id  uuid,
  p_delta       integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.jogadores
  set    pontuacao_total = pontuacao_total + p_delta
  where  id = p_jogador_id
    and  auth_user_id = auth.uid();
end;
$$;

-- ─────────────────────────────────────────────
-- Step 5: Tabela eventos_sala
-- ─────────────────────────────────────────────
create table if not exists public.eventos_sala (
  id        uuid        primary key default gen_random_uuid(),
  sala_id   uuid        not null references public.salas(id) on delete cascade,
  tipo      text        not null,
  payload   jsonb       not null default '{}',
  criado_em timestamptz not null default now()
);

alter table public.eventos_sala enable row level security;

drop policy if exists "eventos_select_public"         on public.eventos_sala;
drop policy if exists "eventos_insert_public"         on public.eventos_sala;
drop policy if exists "eventos_insert_authenticated"  on public.eventos_sala;

-- MVP: leitura e escrita públicas — o código de sala é o mecanismo de controle
create policy "eventos_select_public"
  on public.eventos_sala for select
  using (true);

create policy "eventos_insert_public"
  on public.eventos_sala for insert
  with check (true);

-- ─────────────────────────────────────────────
-- Step 6: View ranking_sala
-- ─────────────────────────────────────────────
create or replace view public.ranking_sala as
select
  j.sala_id,
  j.id                                                                     as jogador_id,
  j.apelido,
  j.equipe,
  j.pontuacao_total,
  count(sj.id) filter (where sj.concluida_em is not null)                  as jogos_concluidos,
  row_number() over (partition by j.sala_id order by j.pontuacao_total desc) as posicao
from public.jogadores j
left join public.sessoes_jogos sj on sj.jogador_id = j.id
group by j.id, j.sala_id, j.apelido, j.equipe, j.pontuacao_total;

grant select on public.ranking_sala to anon, authenticated;
