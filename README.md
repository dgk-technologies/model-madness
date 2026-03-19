# Model Madness 2026

**Live at [modelmadness.ai](https://modelmadness.ai)**

Four AI models. One bracket. Who called it?

On March 19, 2026 — the first day of the NCAA Tournament — we asked Claude, ChatGPT, Gemini, and Grok the same question:

> "Give me a final four full bracket for the NCAA men's tournament that's about to start."

Now we're tracking their picks in real-time as the tournament unfolds.

## The Picks

| Model | Champion | Final Four |
|-------|----------|------------|
| **Claude** (Sonnet 4.6) | Florida | Duke, Arizona, Michigan, Florida |
| **ChatGPT** (GPT-4o) | UConn | UConn, Arizona, Purdue, Houston |
| **Gemini** (2.5 Pro) | Duke | Duke, Arizona, Purdue, Houston |
| **Grok** (Grok 3) | Arizona | Duke, Arizona, Purdue, Florida |

Every AI picked **Arizona** in their Final Four — the only unanimous pick across all four models.

Every AI picked a **different champion** — making this a true four-way battle.

## Features

- **Live scoring** via ESPN's public API (auto-refreshes every 60 seconds)
- **Round-by-round tracker** showing tournament progress from R64 to Championship
- **Animated confetti** when the champion is crowned
- **Share to X** button to post current standings
- **Manual override** for when ESPN's API changes structure
- **Dark mode** with a slick sports-broadcast aesthetic
- **Mobile responsive** design

## How Scoring Works

| Round | Points |
|-------|--------|
| Final Four pick | 10 pts |
| Semifinal winner | 20 pts |
| Champion | 40 pts |
| **Maximum** | **120 pts** |

## Tech Stack

- Single HTML file (zero build step, zero dependencies)
- Vanilla JavaScript
- ESPN public scoreboard API
- Deployed on Vercel

## Deploy Your Own

```bash
# Clone the repo
git clone https://github.com/dgk-technologies/model-madness.git
cd model-madness

# Deploy to Vercel
vercel --prod
```

Or just drag the folder into [vercel.com](https://vercel.com). Zero config needed — it's a single HTML file.

## Updating Picks for Future Years

All picks are defined in the `PICKS` object at the top of the `<script>` block in `index.html`. Update the team names, model versions, and you're ready for next year's tournament.

## Contributing

Found a bug? Want to add a feature? PRs welcome!

Some ideas from the backlog:
- [ ] Add Supabase to persist state server-side
- [ ] Add push notifications when a Final Four team is confirmed
- [ ] Expand scoring to include earlier rounds (R64, R32, S16, E8)

---

**Built with love using [Claude Code](https://claude.ai/claude-code)**

*An experiment in AI prediction and friendly competition. May the best model win.*
