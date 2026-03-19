-- Model Madness 2026 Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- Uses a separate schema to keep it segmented from other projects
--
-- IMPORTANT: After running this, go to Settings > API and add
-- "model_madness" to the "Exposed schemas" list

-- ============================================
-- CREATE SCHEMA
-- ============================================

CREATE SCHEMA IF NOT EXISTS model_madness;

-- ============================================
-- TOURNAMENT STATE (single row, stores live results)
-- ============================================

CREATE TABLE model_madness.tournament_state (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensures single row
  final_four TEXT[] DEFAULT '{}',  -- Array of team names (legacy)
  semis TEXT[] DEFAULT '{}',       -- Teams in championship game (legacy)
  champion TEXT,                   -- Winner
  rounds JSONB DEFAULT '{"r64":0,"r32":0,"s16":0,"e8":0,"ff":0,"ncg":0}',
  winners JSONB DEFAULT '{"r64":{"east":[],"west":[],"midwest":[],"south":[]},"r32":{"east":[],"west":[],"midwest":[],"south":[]},"s16":{"east":[],"west":[],"midwest":[],"south":[]},"e8":{"east":null,"west":null,"midwest":null,"south":null},"ff":[],"ncg":null}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT -- 'espn' or 'manual'
);

-- Insert initial row
INSERT INTO model_madness.tournament_state (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TOURNAMENT HISTORY (for future years)
-- ============================================

CREATE TABLE model_madness.tournament_history (
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

ALTER TABLE model_madness.tournament_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_madness.tournament_history ENABLE ROW LEVEL SECURITY;

-- Anyone can read current state (for live updates)
CREATE POLICY "Anyone can read tournament state" ON model_madness.tournament_state
  FOR SELECT TO anon, authenticated
  USING (true);

-- Only service role can update (via API or admin)
CREATE POLICY "Service role can update state" ON model_madness.tournament_state
  FOR UPDATE TO service_role
  USING (true);

-- Anyone can read history
CREATE POLICY "Anyone can read tournament history" ON model_madness.tournament_history
  FOR SELECT TO anon, authenticated
  USING (true);

-- Only service role can manage history
CREATE POLICY "Service role can manage history" ON model_madness.tournament_history
  FOR ALL TO service_role
  USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION model_madness.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tournament_state_updated_at
  BEFORE UPDATE ON model_madness.tournament_state
  FOR EACH ROW EXECUTE FUNCTION model_madness.update_updated_at();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Allow anon and authenticated to read from the schema
GRANT USAGE ON SCHEMA model_madness TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA model_madness TO anon, authenticated;
