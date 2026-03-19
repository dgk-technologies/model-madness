// Model Madness - Supabase Configuration (OPTIONAL)
//
// To enable Supabase persistence:
// 1. Copy this file to config.js
// 2. Fill in your Supabase project URL and anon key
// 3. Run the schema from supabase/schema.sql in your Supabase SQL Editor
//
// Without this, the site falls back to ESPN-only mode (works fine for most cases).
// The anon key is safe to use client-side - it's designed for public access with RLS.

window.SUPABASE_CONFIG = {
  url: 'https://your-project-id.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
};
