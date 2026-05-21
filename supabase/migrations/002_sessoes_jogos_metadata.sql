-- Migration 002: adiciona duracao_segundos e metadata em sessoes_jogos
-- Necessário para registrar estatísticas de fim de jogo do Sprint 3.

alter table public.sessoes_jogos
  add column if not exists duracao_segundos integer,
  add column if not exists metadata jsonb;
