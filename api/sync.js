// Vercel Cron Job: Syncs ESPN data to Supabase
// Runs every 5 minutes during tournament, configurable in vercel.json
// Requires SUPABASE_SERVICE_ROLE_KEY env var for write access

const { createClient } = require('@supabase/supabase-js');

const ESPN_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=100&limit=100';

// Team name normalization (ESPN full names → short names used in PICKS/BRACKET)
const NORM = {
  // East Region
  'duke blue devils': 'Duke', 'duke': 'Duke',
  'siena saints': 'Siena', 'siena': 'Siena',
  'ohio state buckeyes': 'Ohio State', 'ohio state': 'Ohio State', 'ohio st': 'Ohio State',
  'tcu horned frogs': 'TCU', 'tcu': 'TCU',
  "st. john's red storm": "St. John's", "saint john's red storm": "St. John's", "st. john's": "St. John's", "st john's": "St. John's",
  'northern iowa panthers': 'Northern Iowa', 'northern iowa': 'Northern Iowa', 'uni': 'Northern Iowa',
  'kansas jayhawks': 'Kansas', 'kansas': 'Kansas',
  'cal baptist lancers': 'Cal Baptist', 'california baptist lancers': 'Cal Baptist', 'cal baptist': 'Cal Baptist',
  'louisville cardinals': 'Louisville', 'louisville': 'Louisville',
  'south florida bulls': 'South Florida', 'south florida': 'South Florida', 'usf bulls': 'South Florida', 'usf': 'South Florida',
  'michigan state spartans': 'Michigan State', 'michigan state': 'Michigan State', 'michigan st': 'Michigan State', 'msu': 'Michigan State',
  'north dakota state bison': 'North Dakota State', 'north dakota state': 'North Dakota State', 'north dakota st': 'North Dakota State', 'ndsu': 'North Dakota State',
  'ucla bruins': 'UCLA', 'ucla': 'UCLA',
  'ucf knights': 'UCF', 'ucf': 'UCF', 'central florida knights': 'UCF',
  'uconn huskies': 'UConn', 'connecticut huskies': 'UConn', 'connecticut': 'UConn', 'uconn': 'UConn',
  'furman paladins': 'Furman', 'furman': 'Furman',

  // West Region
  'arizona wildcats': 'Arizona', 'arizona': 'Arizona',
  'liu sharks': 'LIU', 'long island university sharks': 'LIU', 'liu': 'LIU',
  'villanova wildcats': 'Villanova', 'villanova': 'Villanova',
  'utah state aggies': 'Utah State', 'utah state': 'Utah State', 'utah st': 'Utah State',
  'wisconsin badgers': 'Wisconsin', 'wisconsin': 'Wisconsin',
  'high point panthers': 'High Point', 'high point': 'High Point',
  'arkansas razorbacks': 'Arkansas', 'arkansas': 'Arkansas',
  "hawai'i rainbow warriors": "Hawai'i", 'hawaii rainbow warriors': "Hawai'i", "hawai'i": "Hawai'i", 'hawaii': "Hawai'i",
  'byu cougars': 'BYU', 'brigham young cougars': 'BYU', 'byu': 'BYU',
  'texas longhorns': 'Texas', 'texas': 'Texas',
  'gonzaga bulldogs': 'Gonzaga', 'gonzaga': 'Gonzaga',
  'kennesaw state owls': 'Kennesaw State', 'kennesaw state': 'Kennesaw State',
  'miami hurricanes': 'Miami (FL)', 'miami (fl) hurricanes': 'Miami (FL)', 'miami': 'Miami (FL)',
  'missouri tigers': 'Missouri', 'missouri': 'Missouri', 'mizzou': 'Missouri',
  'purdue boilermakers': 'Purdue', 'purdue': 'Purdue',
  'queens royals': 'Queens', 'queens': 'Queens',

  // Midwest Region
  'michigan wolverines': 'Michigan', 'michigan': 'Michigan',
  'howard bison': 'Howard', 'howard': 'Howard',
  'georgia bulldogs': 'Georgia', 'georgia': 'Georgia',
  'saint louis billikens': 'Saint Louis', 'st. louis billikens': 'Saint Louis', 'saint louis': 'Saint Louis', 'st. louis': 'Saint Louis',
  'texas tech red raiders': 'Texas Tech', 'texas tech': 'Texas Tech',
  'akron zips': 'Akron', 'akron': 'Akron',
  'alabama crimson tide': 'Alabama', 'alabama': 'Alabama',
  'hofstra pride': 'Hofstra', 'hofstra': 'Hofstra',
  'tennessee volunteers': 'Tennessee', 'tennessee': 'Tennessee',
  'miami (oh) redhawks': 'Miami (Ohio)', 'miami (ohio) redhawks': 'Miami (Ohio)', 'miami ohio': 'Miami (Ohio)', 'miami (oh)': 'Miami (Ohio)',
  'virginia cavaliers': 'Virginia', 'virginia': 'Virginia',
  'wright state raiders': 'Wright State', 'wright state': 'Wright State',
  'kentucky wildcats': 'Kentucky', 'kentucky': 'Kentucky',
  'santa clara broncos': 'Santa Clara', 'santa clara': 'Santa Clara',
  'iowa state cyclones': 'Iowa State', 'iowa state': 'Iowa State',
  'tennessee state tigers': 'Tennessee State', 'tennessee state': 'Tennessee State',

  // South Region
  'florida gators': 'Florida', 'florida': 'Florida',
  'prairie view a&m panthers': 'Prairie View A&M', 'prairie view a&m': 'Prairie View A&M', 'prairie view': 'Prairie View A&M',
  'clemson tigers': 'Clemson', 'clemson': 'Clemson',
  'iowa hawkeyes': 'Iowa', 'iowa': 'Iowa',
  'vanderbilt commodores': 'Vanderbilt', 'vanderbilt': 'Vanderbilt', 'vandy': 'Vanderbilt',
  'mcneese cowboys': 'McNeese', 'mcneese state cowboys': 'McNeese', 'mcneese': 'McNeese',
  'nebraska cornhuskers': 'Nebraska', 'nebraska': 'Nebraska',
  'troy trojans': 'Troy', 'troy': 'Troy',
  'north carolina tar heels': 'North Carolina', 'north carolina': 'North Carolina', 'unc': 'North Carolina',
  'vcu rams': 'VCU', 'virginia commonwealth rams': 'VCU', 'vcu': 'VCU',
  'illinois fighting illini': 'Illinois', 'illinois': 'Illinois',
  'penn quakers': 'Penn', 'pennsylvania quakers': 'Penn', 'penn': 'Penn',
  "saint mary's gaels": "Saint Mary's", "st. mary's gaels": "Saint Mary's", "saint mary's": "Saint Mary's", "st. mary's": "Saint Mary's",
  'texas a&m aggies': 'Texas A&M', 'texas a&m': 'Texas A&M',
  'houston cougars': 'Houston', 'houston': 'Houston',
  'idaho vandals': 'Idaho', 'idaho': 'Idaho',
};

const normalize = (s) => {
  if (!s) return '';
  const key = s.toLowerCase().trim();
  return NORM[key] || s.trim();
};

module.exports = async function handler(req, res) {
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
      else if (ra === '2R' || ra === 'R32' || notes.includes('second round') || notes.includes('2nd round') || notes.includes('round of 32')) round = 'r32';
      else if (ra === '1R' || ra === 'R64' || notes.includes('first round') || notes.includes('1st round') || notes.includes('round of 64')) round = 'r64';

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
