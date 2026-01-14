-- Execute este SQL no Supabase SQL Editor
-- Acesse: Supabase Dashboard -> SQL Editor -> New Query

CREATE TABLE IF NOT EXISTS premium_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_id TEXT,
  amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por username
CREATE INDEX IF NOT EXISTS idx_premium_users_username ON premium_users(username);

-- Habilitar RLS (Row Level Security) mas permitir acesso anônimo para leitura/escrita
ALTER TABLE premium_users ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT (verificar se é premium)
CREATE POLICY "Allow public read" ON premium_users
  FOR SELECT USING (true);

-- Política para permitir INSERT (adicionar novos premium)
CREATE POLICY "Allow public insert" ON premium_users
  FOR INSERT WITH CHECK (true);

-- Política para permitir UPDATE (atualizar dados)
CREATE POLICY "Allow public update" ON premium_users
  FOR UPDATE USING (true);
