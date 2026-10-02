# Possible Labs · "How to save credits on Seedance 2.5" Reel

## Files
| File | What |
|---|---|
| `possible-labs_seedance-credits_9x16_1080p60.mp4` | Final reel. 30.0 s, 1080×1920, 60 fps, H.264 + AAC 256k |
| `possible-labs_seedance-credits_9x16_1080p60_music-only.mp4` | The same picture with music only (no sound effects) |
| `contact-sheet.jpg` | One frame every 0.5 s, timestamped |
| `../docs/critic/LEDGER.md` | Every critic round: what was found, what changed, numbers before → after |
| `../docs/critic/*.md` | The individual critic reports (storyboard, components, 4 full-film rounds) |

Source: `film/index.html` + `film/js/` (one GSAP timeline, three.js for tip 3). To re-render: `npx hyperframes render film -o out.mp4 --quality delivery`, then `python3 film/tools/mix.py out.mp4 final.mp4`.

## Quality bar: measured on the final render (v4)
| Check | Target | Result | How measured |
|---|---|---|---|
| Frozen screen | ≤ ~1 s per 30 s; no hold > ~0.5 s | 0.2 s total at the kit threshold. The final critic (F4) counted 1.23 s strict and longest 0.17 s at 29.83. Its longest drift-only hold is **1.25 s on the end card (28.18)**: only the logo is moving there. The kit allows the final CTA to hold, but you may want more motion there (see below) | `kit/scripts/frozen-time.sh` and critic frame-diff |
| Frame 0 | a finished composition | ✓ The cover headline, box, sub-line and visual are all present at t=0 | critics F1–F3 |
| Loudness | steady web level, no clipping | −14.2 LUFS integrated, true peak −1.2 dBFS, LRA 3.1 LU | ffmpeg ebur128 |
| Effects vs music | never louder than the music | Each effect peaks ≥2 dB under the local music peak and lifts its own band ≤ +6 dB (`review/mix-v4.txt`). Broadband, the effects track is at most level with the music (+0.8 dB in one 50 ms window at 1.60 s) | `tools/mix.py` report; critic F3 compared against the music-only file |
| Text contrast | ≥ 4.5:1 | Ink on paper ~17:1; checklist numbers 5.5:1; audio tags 12–15:1. **Exception:** cream on brand orange in the answer box is ~3.0:1, kept on purpose as the brand pairing. All of that text is ≥55 px caps, which passes WCAG AA for large text (3:1) | critic sampling |
| Text collisions | none | None found in 1/30 s windows around every transition (F3) | critic |
| Reels safe zone | key content clear of bottom ~360 px / right ~140 px | Key content stays at x ≤ ~940 below y 1000 and above y 1560 | critic |
| Cuts on the beat | every scene change on the 120 BPM grid | All 11 changes are on 0.5 s multiples (2.5, 5.0 … 26.5) | timeline |
| 3D brand colour | 3D background sits on brand paper | The canvas background renders 228/223/214 against paper 239/232/219 (ΔE ≈3.9, same warm hue) | builder measurement |
| Determinism | same frame from any seek order | The 3D canvas is byte-identical across seek orders | builder test |
| Honesty | only facts-file words | Every on-screen word is in `docs/FACTS.md`. No numbers, prices or claims beyond the slides | critics R0, F1 |

The final critic verdict was **SHIP** on v3 (F3). The two optional polish items it listed went into v4 and were verified by F4 (`docs/critic/f4-verify.md`), which also said **SHIP**. The clicks were fixed; the end-card hold is only PARTLY fixed, because just the sun and wordmark move.

## Decisions made without you
- **Length:** 30 s. Each of the 8 tips gets 2.5 s and shows only its headline plus the orange answer. The slides' sub-copy is dropped.
- **Music:** library music sites were blocked from the build machine, so the 120 BPM bed is **synthesised in code** (`tools/music.py`). It uses no samples and is not AI-generated. The sound effects come from HyperFrames' bundled Pixabay-licensed library (`assets/audio/SFX-CREDITS.md`). On Instagram you can swap in any trending 120 BPM track; every cut lands on a beat.
- **Imagery:** the photos are cropped from your own carousel slides. Everything else is built in code, including the three.js "rough 3D block" street in tip 3. No new imagery was generated.

## What a human should still check
1. **Listen.** I (Claude) could only measure the audio, not hear it. Judge the synthesised music's feel and whether the soft clicks are audible enough on a phone. About 15 of the 38 small effects add almost nothing in their band.
2. **The cream-on-orange box text** is ~3:1 (brand pairing, passes for large text). Decide whether you want it darker.
3. **Tip 2's headline is smaller** than the others (it's the longest, "BEFORE YOU GENERATE."), and **"THEN GENERATE."** lands at a modest size. Critics called both design-ambition gaps, not bugs.
4. **Layout repetition:** every tip uses headline, then answer box, then visual. That suits a reading-first explainer, but critics noted it is less varied than premium launch films.
5. **Photo sharpness:** the reference photos are crops of the slide images (some only ~160–550 px), so they are upscaled and slightly soft.
6. **End card:** the last ~1.2 s is a near-still hold with only the logo moving. Watch it and decide if it feels finished or wants more motion.
7. **Facts:** confirm the tips are accurate for Seedance 2.5; I only reproduced your slides.
