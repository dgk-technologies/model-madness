// Vercel Cron Job: Syncs ESPN data to Supabase
// Runs every 5 minutes during tournament, configurable in vercel.json
// Requires SUPABASE_SERVICE_ROLE_KEY env var for write access

import { createClient } from '@supabase/supabase-js';

const ESPN_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=100&limit=100';

// Team name normalization
const NORM = {
  'duke blue devils': 'Duke', 'duke': 'Duke',
  'arizona wildcats': 'Arizona', 'arizona': 'Arizona',
  'michigan wolverines': 'Michigan', 'michigan': 'Michigan',
  'florida gators': 'Florida', 'florida': 'Florida',
  'uconn huskies': 'UConn', 'connecticut': 'UConn', 'uconn': 'UConn',
  'purdue boilermakers': 'Purdue', 'purdue': 'Purdue',
  'houston cougars': 'Houston', 'houston': 'Houston',
  'iowa state cyclones': 'Iowa St', 'iowa state': 'Iowa St',
};

const normalize = (s) => s ? (NORM[s.toLowerCase().trim()] || s.trim()) : '';

export default async function handler(req, res) {
  // Verify this is a cron request or has auth
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  // Allow Vercel cron (no auth needed) or manual trigger with secret
  if (req.headers['x-vercel-cron'] !== '1' && authHeader !== `Bearer ${cronSecret}`) {
    // Also allow if no CRON_SECRET is set (for testing)
    if (cronSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Supabase not configured for sync' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Fetch from ESPN
    const espnRes = await fetch(ESPN_URL, { cache: 'no-store' });
    if (!espnRes.ok) {
      throw new Error(`ESPN returned ${espnRes.status}`);
    }
    const data = await espnRes.json();

    // Parse ESPN data
    const ff = new Set();
    const semis = new Set();
    let champion = null;
    const rounds = { r64: 0, r32: 0, s16: 0, e8: 0, ff: 0, ncg: 0 };

    // Track winners by round and region for full bracket scoring
    const winners = {
      r64: { east: new Set(), west: new Set(), midwest: new Set(), south: new Set() },
      r32: { east: new Set(), west: new Set(), midwest: new Set(), south: new Set() },
      s16: { east: new Set(), west: new Set(), midwest: new Set(), south: new Set() },
      e8:  { east: null, west: null, midwest: null, south: null },
      ff:  new Set(),
      ncg: null,
    };

    // Region detection from notes
    const detectRegion = (notes) => {
      const n = notes.toLowerCase();
      if (n.includes('east')) return 'east';
      if (n.includes('west')) return 'west';
      if (n.includes('midwest')) return 'midwest';
      if (n.includes('south')) return 'south';
      return null;
    };

    for (const ev of (data.events || [])) {
      const comp = ev.competitions?.[0];
      if (!comp) continue;

      const notes = (comp.notes || []).map(n => (n.headline || '').toLowerCase()).join(' ');
      const ra = (comp.type?.abbreviation || '').toString().toUpperCase();

      // Determine round
      let round = null;
      if (ra === 'NCG' || ra === 'NC' || notes.includes('national championship') || notes.includes('championship game')) round = 'ncg';
      else if (ra === 'FF' || ra === 'NSF' || notes.includes('final four') || notes.includes('semifinal')) round = 'ff';
      else if (ra === 'EE' || ra === 'RE' || notes.includes('elite eight') || notes.includes('regional final')) round = 'e8';
      else if (ra === 'SS' || ra === 'S16' || notes.includes('sweet 16') || notes.includes('sweet sixteen') || notes.includes('regional semifinal')) round = 's16';
      else if (ra === '2R' || ra === 'R32' || notes.includes('second round') || notes.includes('round of 32')) round = 'r32';
      else if (ra === '1R' || ra === 'R64' || notes.includes('first round') || notes.includes('round of 64')) round = 'r64';

      // Count completed games
      if (round && ev.status?.type?.completed) {
        rounds[round]++;
      }

      if (!ev.status?.type?.completed) continue;

      const comps = comp.competitors || [];
      const win = comps.find(c => c.winner);
      const lose = comps.find(c => !c.winner);
      if (!win) continue;

      const wn = normalize(win.team?.displayName || win.team?.name || '');
      const ln = lose ? normalize(lose.team?.displayName || lose.team?.name || '') : '';
      const region = detectRegion(notes);

      if (round === 'ncg' && wn) {
        champion = wn;
        semis.add(wn);
        if (ln) semis.add(ln);
        ff.add(wn);
        if (ln) ff.add(ln);
        winners.ncg = wn;
        winners.ff.add(wn);
        if (ln) winners.ff.add(ln);
      } else if (round === 'ff' && wn) {
        semis.add(wn);
        ff.add(wn);
        if (ln) ff.add(ln);
        winners.ff.add(wn);
      } else if (round === 'e8' && wn) {
        ff.add(wn);
        if (region) winners.e8[region] = wn;
      } else if (round === 's16' && wn && region) {
        winners.s16[region].add(wn);
      } else if (round === 'r32' && wn && region) {
        winners.r32[region].add(wn);
      } else if (round === 'r64' && wn && region) {
        winners.r64[region].add(wn);
      }
    }

    // Convert Sets to Arrays for storage
    const winnersJson = {
      r64: { east: [...winners.r64.east], west: [...winners.r64.west], midwest: [...winners.r64.midwest], south: [...winners.r64.south] },
      r32: { east: [...winners.r32.east], west: [...winners.r32.west], midwest: [...winners.r32.midwest], south: [...winners.r32.south] },
      s16: { east: [...winners.s16.east], west: [...winners.s16.west], midwest: [...winners.s16.midwest], south: [...winners.s16.south] },
      e8:  winners.e8,
      ff:  [...winners.ff],
      ncg: winners.ncg,
    };

    // Update Supabase
    const { error } = await supabase
      .schema('model_madness')
      .from('tournament_state')
      .update({
        final_four: [...ff].filter(Boolean),
        semis: [...semis].filter(Boolean),
        champion: champion,
        rounds: rounds,
        winners: winnersJson,
        updated_by: 'espn-sync'
      })
      .eq('id', 1);

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      data: {
        final_four: [...ff],
        semis: [...semis],
        champion,
        rounds,
        winners: winnersJson
      }
    });
  } catch (e) {
    console.error('Sync error:', e);
    res.status(500).json({ error: e.message });
  }
}
