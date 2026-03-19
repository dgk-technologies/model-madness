// Vercel Serverless Function
// Returns Supabase config from environment variables
// Set these in Vercel Dashboard > Settings > Environment Variables

export default function handler(req, res) {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  // Only return config if both are set
  if (url && anonKey) {
    res.setHeader('Cache-Control', 's-maxage=3600'); // Cache for 1 hour
    res.status(200).json({ url, anonKey });
  } else {
    res.status(404).json({ error: 'Supabase not configured' });
  }
}
