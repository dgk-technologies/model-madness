# Model Madness 2026 — Methodology & Prompt Log

This document tracks how we collected bracket predictions from each AI model, issues encountered, and corrections made.

---

## Timeline

- **March 15, 2026:** Selection Sunday — official bracket announced
- **March 19, 2026:** Brackets requested from all four AI models
- **March 19, 2026:** Validation revealed ChatGPT and Grok had significant errors

---

## Initial Prompts

### Prompt 1 — Final Four request (March 19, 2026)

> I want you to come up with a final four full bracket for the NCAA men's final four that's about to start.

### Prompt 2 — Full bracket expansion

> give me your full bracket from the round of 64 through the final four (which you already gave), don't change anything you already predicted.

### Prompt 3 — Accuracy check (when errors discovered)

> you did not pick accurate teams or regions - check your results for accuracy

### Prompt 4 — Detailed correction (for Grok, after Prompt 3 failed)

> You still have errors. Marquette, Auburn, and Creighton are NOT in the 2026 tournament. Purdue is in the WEST (2-seed), not Midwest. Iowa State is in the MIDWEST (2-seed), not West. Houston is in the SOUTH (2-seed), not West. Illinois is in the SOUTH (3-seed), not Midwest. Kentucky is in the MIDWEST (7-seed), not South. Please fix these and give me specific team names for every pick — no "or similar" or "lower seed."

### Prompt 5 — Logical contradiction fix (for ChatGPT)

> There's a contradiction: You have Purdue losing to Arizona in the West Elite 8, but also winning the Midwest Elite 8. Purdue is only in the West region. If you want Purdue in your Final Four, they need to beat Arizona in the West. Otherwise, pick a different Midwest winner (Michigan or Tennessee based on your Sweet 16). Which do you want?

### Prompt 6 — R64 contradiction fix (for Grok)

> Almost there! Two issues: (1) In Midwest, you have both Georgia (8) and Saint Louis (9) as R64 winners — they play each other. Pick one, and add your Virginia vs Wright State pick. (2) In South, you have both Saint Mary's (7) and Texas A&M (10) as R64 winners — they play each other. Pick one, and add your Illinois vs Penn pick.

---

## Model Responses & Issues

### Claude (Sonnet 4.6)

**Status:** ✅ Clean — no corrections needed

**Initial response:** Full 63-game bracket with all teams correct, all seeds correct, all regions correct.

**Errors found:** None

---

### Gemini (2.5 Pro)

**Status:** ⚠️ Partial — format issues but no fabricated teams

**Initial response:** Provided regional winners by round in table format, but did not list all 16 teams per region explicitly. Some teams appeared in ambiguous positions in the table format.

**Errors found:**
- Iowa State appeared in wrong regional bracket position in table
- Nebraska appeared in wrong regional bracket position in table
- No fabricated teams

**Resolution:** Used the picks as provided; minor format issues don't affect scoring.

---

### ChatGPT (GPT-4o)

**Status:** ❌ Required full rebuild

**Initial response:** Generated a bracket that does not reflect the actual 2026 NCAA Tournament field.

**Errors found:**
- **33 fabricated teams** not in the 2026 tournament
- **0 of 4 regions** structurally correct
- Duke (overall 1-seed) placed as 4-seed in wrong region
- UConn (2-seed) listed as 1-seed in East

**Fabricated teams:**
Florida Atlantic, Northwestern, Yale, UAB, Duquesne, Morehead State, Washington State, Drake, South Dakota State, James Madison, Vermont, Oakland, Colorado, Marquette, Western Kentucky, Samford, South Carolina, Oregon, Creighton, Saint Peter's, Mississippi State, Grand Canyon, Charleston, Baylor, Colgate, Dayton, Nevada, Long Beach State, New Mexico, NC State, Colorado State, Auburn (first four out), San Diego State (first four out)

**Teams in wrong regions:**
BYU, Illinois, Iowa State, Duke, Wisconsin, Texas Tech, Kentucky, Florida, Gonzaga, Kansas, McNeese, TCU, Utah State, Tennessee, Michigan State, Saint Mary's, Alabama, Clemson, North Carolina

### Correction attempt #1

**Prompt sent:** Prompt 3 (accuracy check)

**Response:** [pending]

---

### Grok (Grok 3)

**Status:** ❌ Required partial rebuild (3 of 4 regions)

**Initial response:** East region correct. West, Midwest, and South contained errors.

**Errors found:**
- **3 fabricated teams:** Marquette, Auburn (first four out), Creighton
- **~9 teams in wrong regions or seeds**
- East region was fully correct
- Grok self-flagged uncertainty with note "region mix" next to Alabama

**Teams in wrong regions/seeds:**
- Iowa State: listed as West 3-seed → actually Midwest 2-seed
- Gonzaga: listed as West 7-seed → actually West 3-seed
- Houston: listed as West 2-seed → actually South 2-seed
- Purdue: listed as Midwest 7-seed → actually West 2-seed
- Illinois: listed as Midwest 6-seed → actually South 3-seed
- Texas A&M: listed as South 7-seed → actually South 10-seed
- Kentucky: listed as South 3-seed → actually Midwest 7-seed
- Alabama: listed as South 2-seed → actually Midwest 4-seed

### Correction attempt #1

**Prompt sent:** Prompt 3 (accuracy check)

**Response:** [pending]

---

## The Actual 2026 Bracket

For reference, the official Selection Sunday bracket:

### East Region
| Seed | Team |
|------|------|
| 1 | Duke |
| 2 | UConn |
| 3 | Michigan State |
| 4 | Kansas |
| 5 | St. John's |
| 6 | Louisville |
| 7 | UCLA |
| 8 | Ohio State |
| 9 | TCU |
| 10 | UCF |
| 11 | South Florida |
| 12 | Northern Iowa |
| 13 | Cal Baptist |
| 14 | North Dakota State |
| 15 | Furman |
| 16 | Siena |

### West Region
| Seed | Team |
|------|------|
| 1 | Arizona |
| 2 | Purdue |
| 3 | Gonzaga |
| 4 | Arkansas |
| 5 | Wisconsin |
| 6 | BYU |
| 7 | Miami (FL) |
| 8 | Villanova |
| 9 | Utah State |
| 10 | Missouri |
| 11 | Texas |
| 12 | High Point |
| 13 | Hawai'i |
| 14 | Kennesaw State |
| 15 | Queens |
| 16 | LIU |

### Midwest Region
| Seed | Team |
|------|------|
| 1 | Michigan |
| 2 | Iowa State |
| 3 | Virginia |
| 4 | Alabama |
| 5 | Texas Tech |
| 6 | Tennessee |
| 7 | Kentucky |
| 8 | Georgia |
| 9 | Saint Louis |
| 10 | Santa Clara |
| 11 | Miami (Ohio) |
| 12 | Akron |
| 13 | Hofstra |
| 14 | Wright State |
| 15 | Tennessee State |
| 16 | Howard |

### South Region
| Seed | Team |
|------|------|
| 1 | Florida |
| 2 | Houston |
| 3 | Illinois |
| 4 | Nebraska |
| 5 | Vanderbilt |
| 6 | North Carolina |
| 7 | Saint Mary's |
| 8 | Clemson |
| 9 | Iowa |
| 10 | Texas A&M |
| 11 | VCU |
| 12 | McNeese |
| 13 | Troy |
| 14 | Penn |
| 15 | Idaho |
| 16 | Prairie View A&M |

---

## Initial Bracket Accuracy (Before Corrections)

This measures how accurately each model produced the real 2026 tournament field when first asked on March 19, 2026 — the day Round of 64 games began.

| Model | Fabricated Teams | Wrong Region/Seed | Initial Accuracy | Initial Grade |
|-------|------------------|-------------------|------------------|---------------|
| Claude | 0 | 0 | 64/64 teams correct | **A+** |
| Gemini | 0 | ~4 minor | 64/64 teams, format issues | **A-** |
| Grok | 3 | ~9 | 52/64 teams usable | **D** |
| ChatGPT | 33 | ~19 | 12/64 teams usable | **F** |

---

## Bracket Construction Grade (Initial → Final)

This grades the full journey: initial accuracy, number of correction attempts needed, and whether the final bracket is logically valid.

### Grading Rubric

| Grade | Criteria |
|-------|----------|
| **A+** | Perfect on first attempt. No corrections needed. |
| **A** | Minor issues on first attempt. 0 corrections needed. |
| **A-** | Format/presentation issues only. 0 corrections needed. |
| **B** | 1 correction needed. Final bracket is accurate. |
| **C** | 2 corrections needed. Final bracket is accurate. |
| **D** | 2+ corrections needed. Final bracket still has minor issues. |
| **F** | 2+ corrections needed. Final bracket still has major issues or logical contradictions. |

### Final Grades

| Model | Initial | Corrections | Final Status | Grade |
|-------|---------|-------------|--------------|-------|
| Claude | 64/64 correct | 0 | ✅ Perfect | **A+** |
| Gemini | 64/64, format issues | 0 | ✅ Usable | **A-** |
| Grok | 52/64 usable | 3 | ✅ Complete | **D** |
| ChatGPT | 12/64 usable | 3 | ✅ Complete | **D** |

### Detailed Breakdown

**Claude (A+)**
- Prompt 1 → Perfect bracket
- Prompt 2 → Full R64-Championship, all correct
- Zero issues. Gold standard.

**Gemini (A-)**
- Prompt 1 → Correct Final Four
- Prompt 2 → Regional winners in table format (not full R64 explicit picks)
- Minor: Iowa State/Nebraska positioning ambiguous in table
- No fabricated teams. Usable as-is.

**ChatGPT (D)**
- Prompt 1 → Final Four picked
- Prompt 2 → 33 fabricated teams, 0/4 regions correct
- Prompt 3 → Acknowledged errors, provided correct matchups
- Prompt 3 follow-up → Provided picks, but had logical contradiction (Purdue in two regions)
- Prompt 5 → Fixed! Purdue wins West, Tennessee wins Midwest
- **Final: 3 corrections needed. Grade: D**

**Grok (D)**
- Prompt 1 → Final Four picked
- Prompt 2 → East correct, 3 regions broken, 3 fabricated teams
- Prompt 3 → Still had same errors + vague picks ("or similar")
- Prompt 4 → Fixed fabricated teams but introduced R64 contradictions (8v9, 7v10 both listed)
- Prompt 6 → Fixed! Contradictions resolved, all picks specific
- **Final: 3 corrections needed. Grade: D**

### What This Tells Us

- **Claude** had perfect access to the Selection Sunday bracket and reproduced it exactly
- **Gemini** had the right teams but presented them in an ambiguous table format
- **Grok** mixed real teams with 3 fabricated ones, and misplaced ~9 teams across regions
- **ChatGPT** appears to have hallucinated an entire bracket from training data — 33 teams it listed are not in the 2026 tournament

### Accuracy Score Calculation

```
Initial Accuracy = (64 - fabricated - wrong_region) / 64

Claude:  (64 - 0 - 0)  / 64 = 100%
Gemini:  (64 - 0 - 4)  / 64 = 94%
Grok:    (64 - 3 - 9)  / 64 = 81%
ChatGPT: (64 - 33 - 19) / 64 = 19% (capped at teams that existed)
```

Note: ChatGPT's score is approximate since many "wrong region" teams were also fabricated.

---

## Key Finding

Two of four models (ChatGPT and Grok) could not produce the actual 2026 tournament field on the day the first round tipped off. This suggests:

1. **ChatGPT** appears to have reconstructed a "plausible" bracket from training data rather than accessing real Selection Sunday results
2. **Grok** had partial access but mixed in fabricated teams and misplaced real teams across regions

This finding is documented on modelmadness.ai as part of the experiment.

---

## Correction Log

### Claude Corrections
No corrections needed — 100% accurate on first attempt.

### Gemini Corrections
No corrections needed — format issues only, all teams correct.

### ChatGPT Corrections

| Attempt | Prompt | Result |
|---------|--------|--------|
| 1 | Prompt 3 (accuracy check) | ✅ Matchups now correct. Needs picks (who wins each game). |
| 2 | "Give me your picks — who wins each game?" | ⚠️ Picks provided but has logical contradiction: Purdue loses to Arizona in West E8, but also "wins" Midwest E8. |
| 3 | Prompt 5 (contradiction fix) | ✅ Fixed! Purdue now beats Arizona in West. Tennessee wins Midwest. |

**Status:** ✅ COMPLETE. ChatGPT's bracket is now logically consistent and scoreable.

**Final ChatGPT Bracket:**
- East winner: UConn
- West winner: Purdue (beats Arizona in E8)
- Midwest winner: Tennessee (beats Michigan in E8)
- South winner: Houston
- Final Four: UConn over Tennessee, Houston over Purdue
- Champion: UConn

### Grok Corrections

| Attempt | Prompt | Result |
|---------|--------|--------|
| 1 | Prompt 3 (accuracy check) | ❌ Still has errors: Marquette, Auburn, Creighton (fabricated). Purdue/Iowa State/Houston/Illinois/Kentucky in wrong regions. Vague picks ("or similar"). |
| 2 | Prompt 4 (detailed correction) | [pending] |

**Prompt 4 (detailed correction):**
> You still have errors. Marquette, Auburn, and Creighton are NOT in the 2026 tournament. Purdue is in the WEST (2-seed), not Midwest. Iowa State is in the MIDWEST (2-seed), not West. Houston is in the SOUTH (2-seed), not West. Illinois is in the SOUTH (3-seed), not Midwest. Kentucky is in the MIDWEST (7-seed), not South. Please fix these and give me specific team names for every pick — no "or similar" or "lower seed."

**Prompt 4 response:** Fixed fabricated teams and region placements, but introduced new contradictions:
- Midwest: Both Georgia (8) AND Saint Louis (9) listed as R64 winners (they play each other)
- South: Both Saint Mary's (7) AND Texas A&M (10) listed as R64 winners (they play each other)
- Missing: Virginia (3) result in Midwest, Illinois (3) result in South

| Attempt | Prompt | Result |
|---------|--------|--------|
| 3 | Prompt 6 (contradiction fix) | ✅ Fixed! Saint Louis over Georgia, Saint Mary's over Texas A&M. Virginia and Illinois picks added. |

**Status:** ✅ COMPLETE. Grok's bracket is now logically consistent and scoreable.

**Final Grok Bracket:**
- East winner: Duke
- West winner: Arizona (beats Purdue in E8)
- Midwest winner: Michigan
- South winner: Florida
- Final Four: Duke vs Florida, Arizona vs Michigan
- Championship: Arizona over Duke
- Champion: Arizona

---

## Final Brackets Used

All brackets are now complete and scoreable.

### Claude — Final Bracket (A+)
*Original submission — no changes needed*

| Round | East | West | Midwest | South |
|-------|------|------|---------|-------|
| E8 Winner | Duke | Arizona | Michigan | Florida |
| FF Winners | Duke, Florida |
| Champion | **Florida** |

### Gemini — Final Bracket (A-)
*Original submission — minor format issues only*

| Round | East | West | Midwest | South |
|-------|------|------|---------|-------|
| E8 Winner | Duke | Arizona | Purdue | Houston |
| FF Winners | Duke, Purdue |
| Champion | **Duke** |

### ChatGPT — Final Bracket (D)
*Required 3 corrections to fix*

| Round | East | West | Midwest | South |
|-------|------|------|---------|-------|
| E8 Winner | UConn | Purdue | Tennessee | Houston |
| FF Winners | UConn, Houston |
| Champion | **UConn** |

### Grok — Final Bracket (D)
*Required 3 corrections to fix*

| Round | East | West | Midwest | South |
|-------|------|------|---------|-------|
| E8 Winner | Duke | Arizona | Michigan | Florida |
| FF Winners | Duke, Arizona |
| Champion | **Arizona** |

---

## Champion Picks Summary

| Model | Champion | Grade |
|-------|----------|-------|
| Claude | Florida | A+ |
| Gemini | Duke | A- |
| ChatGPT | UConn | D |
| Grok | Arizona | D |

All four models picked different champions.
