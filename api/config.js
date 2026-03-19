// Vercel Serverless Function
// Returns Supabase config from environment variables
// Works with both manual env vars and Vercel-Supabase integration

module.exports = function handler(req, res) {
  // Check both naming conventions (manual and Vercel integration)
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Only return config if both are set
  if (url && anonKey) {
    res.setHeader('Cache-Control', 's-maxage=3600'); // Cache for 1 hour
    res.status(200).json({ url, anonKey });
  } else {
    res.status(404).json({ error: 'Supabase not configured' });
  }
}
