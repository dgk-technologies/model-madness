-- Model Madness 2026 Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- Uses public schema with mm_ prefix to keep tables organized

-- ============================================
-- TOURNAMENT STATE (single row, stores live results)
-- ============================================

CREATE TABLE IF NOT EXISTS mm_tournament_state (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensures single row
  final_four TEXT[] DEFAULT '{}',  -- Array of team names
  semis TEXT[] DEFAULT '{}',       -- Teams in championship game
  champion TEXT,                   -- Winner
  rounds JSONB DEFAULT '{"r64":0,"r32":0,"s16":0,"e8":0,"ff":0,"ncg":0}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT -- 'espn' or 'manual'
);

-- Insert initial row
INSERT INTO mm_tournament_state (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TOURNAMENT HISTORY (for future years)
-- ============================================

CREATE TABLE IF NOT EXISTS mm_tournament_history (
  year INTEGER PRIMARY KEY,
  final_four TEXT[],
  semis TEXT[],
  champion TEXT,
  winner_model TEXT,  -- Which AI won that year
  winner_score INTEGER,
  picks JSONB,        -- Full picks object for that year
  completed_at TIMESTAMPTZ
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE mm_tournament_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_tournament_history ENABLE ROW LEVEL SECURITY;

-- Anyone can read current state (for live updates)
DROP POLICY IF EXISTS "Anyone can read tournament state" ON mm_tournament_state;
CREATE POLICY "Anyone can read tournament state" ON mm_tournament_state
  FOR SELECT TO anon, authenticated
  USING (true);

-- Only service role can update (via API or admin)
DROP POLICY IF EXISTS "Service role can update state" ON mm_tournament_state;
CREATE POLICY "Service role can update state" ON mm_tournament_state
  FOR UPDATE TO service_role
  USING (true);

-- Anyone can read history
DROP POLICY IF EXISTS "Anyone can read tournament history" ON mm_tournament_history;
CREATE POLICY "Anyone can read tournament history" ON mm_tournament_history
  FOR SELECT TO anon, authenticated
  USING (true);

-- Only service role can manage history
DROP POLICY IF EXISTS "Service role can manage history" ON mm_tournament_history;
CREATE POLICY "Service role can manage history" ON mm_tournament_history
  FOR ALL TO service_role
  USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION mm_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS mm_tournament_state_updated_at ON mm_tournament_state;
CREATE TRIGGER mm_tournament_state_updated_at
  BEFORE UPDATE ON mm_tournament_state
  FOR EACH ROW EXECUTE FUNCTION mm_update_updated_at();
