# Core intro film: final quality report (v11)

**Deliverables**
- `core-intro-9x16-1080p60.mp4`: 1080×1920, 60 fps, 27.0 s, H.264 plus AAC 48 kHz stereo.
- `core-intro-9x16-1080p60-music-only.mp4`: the same picture with the score only (no sound effects).
- Contact sheets: `contact-sheet-0.5s.jpg` and the 0.2 s sheets (part 1 covers 0–13.6 s, part 2 covers 13.6–27 s).
- Frames: `frame-0.png` (the opening frame) and `poster.png` (the end card).
- Records: the critic ledger in `../review/LEDGER.md`, and every critic report as `../review/r0…r10*.md`.

Only one size was requested (9:16), so it is the only size delivered.

## Quality bar: measured (final critic r10 plus builder checks)
| Check | Target | Result | |
|---|---|---|---|
| Frozen time | ≤ ~1 s per 30 s; no still stretch > ~0.5 s | 10 fps kit script: 0.4 s, all on the CTA. Strict 60 fps (critic): 1.45 s of near-identical frames, longest hold before the end card 0.22 s | Pass |
| Frame 0 | Finished composition | Wall of source cards with the full headline on an opaque card (`frame-0.png`) | Pass |
| Text contrast | ≥ 4.5:1 | Settled text 7.7:1 to 17.9:1 (CTA about 9:1 or higher, "Ainfinite AI" about 8:1) | Pass |
| Text collisions | None, including mid-transition | None found in r9 or r10 | Pass |
| Brand colour | Background #F7F8FB, purple #6100A8 | Background #F6F7FC; purple flood #6000A7; 3D clear colour set to the brand value with tone mapping off | Pass |
| Loudness | Steady and web-comfortable, no clipping | −16.9 LUFS integrated, true peak −2.8 dBFS, LRA 3.2 LU | Pass |
| Effects vs music | About +3–4 dB in band, never above the music, no 10 dB spikes at 2–8 kHz | Taps and pops +3.0 to +7.8 dB in band (50 ms); 2–8 kHz max +3.9 dB; whooshes +0.5 to +3 dB (deliberately soft) | Pass |
| Determinism | Any frame renders the same from any seek order | 5 frames rendered forward vs reverse order: max pixel difference 0 | Pass |
| Facts | Only words in FACTS.md | Every on-screen word verified verbatim by critics r4–r10 | Pass |

## Still needs a human (nobody has watched or listened yet)
1. **Listen once on a phone speaker.**
   - The whooshes are deliberately soft (about +1 dB over the music).
   - There is a 0.4 s dead stop in the score at 15.6–16.0 s, under the purple takeover.
   - Confirm both feel intended.
2. **Watch at full speed:**
   - the 13.40 dissolve into the steps (it should read as soft, not a blink);
   - the ring's edge while it grows and spins (1.7–2.6 s and 21–26 s);
   - the purple-to-boundary morph at 17.7 s.
3. **Check the logo.** The wordmark is rebuilt in SVG from the screenshot because no logo file was supplied. Swap in the official Core logo before publishing.
4. **Check the music.** The music libraries and the style-reference site (whatships.com) were blocked by this sandbox's network policy. The score is therefore original and composed in code (`tools/score.py`). A library track edited to the same cut points (all cuts sit on a 0.5 s grid at 120 BPM) would probably sound more produced.
5. **Check the effects licence.** The sound effects come from the Pixabay library bundled with HyperFrames (`assets/sfx/CREDITS-pixabay.md`).
6. **Check the safe zone.** The CTA sits at y 1020–1220. The trust chips (y 1460–1710) fall in the zone that Reels and TikTok cover with their UI; that is fine for LinkedIn and Shorts.

## Not claimed on screen
No numbers, customers, ratings, outcomes, certifications or prices appear. Every line is verbatim from the client's own post (see `../FACTS.md`). Nothing in the film is AI-generated imagery; it is all built in code.

## Rebuild
- **Picture:** `npx hyperframes render core-film -o out.mp4 --fps 60`
- **Score:** `python3 tools/score.py assets/music/score-raw.wav 27`
- **Mix:** `python3 tools/offline-mix.py <picture> <out> --score score-raw.wav --music-lufs -17 --dur 27 --no-comp --hf-cap 99`. Per-event levels live in `assets/sfx/plan.json`; `tools/level-sfx.py` re-solves them.
