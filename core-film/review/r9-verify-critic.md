# R9 verify critic: film-v10.mp4

**What changed (measured).** Frame diff against v9 (60 fps, 270×480): only frames 804–814 (13.40–13.57) differ. The music stem md5 matches v9 (a88dd58…). The film stems differ only at 19.58–19.69 s.

## r8 items
| Item | Status | Evidence |
|---|---|---|
| 1. Path tap 19.67 +7–8 dB | **FIXED** | Its effects-stem band peak (400–1000 Hz) went from −23.7 to **−16.2 dBFS**, so it now matches its siblings (−17.2). Film over music, 50 ms: **peak +3.4 / RMS +3.2** (v9 +0.1 / +0.7). Siblings 19.47 and 19.87 read +4.2/+2.6 and +5.9/+2.6. The run now goes tap-tap-tap-tap. 2–8 kHz at 10 ms: +0.3. |
| 2. (opt) 13.40 dip | **FIXED** | v9 had 2 empty frames (805–806, 0 ink px). In v10, 805 is the only near-empty frame (99 px). By 806 the cards are at 15k px, and they cross-dissolve over the slab's tail at 804–806. "Useful output." text clears the bottom edge by ~150 px. Rows 1850+ hold only the dashed card border and the dot grid. |
| "Build once." drift, empty slab 17.70, S11 ring | Unchanged | Pixel-identical to v9. |

## New defects or regressions
- **Picture:** none. The 0.2 s contact sheet is identical to v9 outside 13.40–13.57. In the new window, the faint cards and the slab overlap for about 3 frames (13.40–13.43). That reads as a dissolve, not a collision.
- **Audio:** none. No other event moved, and the raised tap adds no 2–8 kHz spike.

## Quality bar (measured)
| Check | Target | v10 | Result |
|---|---|---|---|
| Frozen time | ≤ ~1 s/30 s; hold ≤ 0.6 s | 0.92 s total at a strict diff < 0.1; the longest hold before the end card is 0.18 s (8.85, 18.2); end card 0.25 s | Pass |
| Loudness | ~−16 LUFS, TP ≤ −1 | −16.9 LUFS, TP −2.8 dBFS | Pass |
| Dynamics | LRA 1.5–3+, no dying end | LRA 3.2 (−17.9/−14.8); M −12.7 at 24.3, fading from 26.5 | Pass |
| Effects in-band | ~+4 dB, never inaudible | Taps and pops +3.0 to +7.8 (50 ms peak); whooshes +0.5 to +1.1 (500 ms RMS); 15.45 whoosh +0.1 | Pass on taps; whooshes soft by design (see below) |
| 2–8 kHz cap | no 10+ dB spikes | Max +3.5 (chime 16.41); all taps ≤ +0.6 | Pass |
| Contrast | WCAG AA, settled | Settled frames are pixel-identical to v9 (16.8:1, 10.2:1, 16.3:1, end card 17.9:1) | Pass |
| Background | #F7F8FB | #F6F7FC (unchanged) | Pass |
| Facts | FACTS.md only | No new words. The changed window has the same verbatim lines as v9 | Pass |
| Determinism | — | Not tested | n/a |

## Needs a human ear or eye
- **Whooshes** measure +0.5 to +1.1 dB over the music, and the 15.45 whoosh is effectively absent. The meter can't tell whether that feels calm or missing on a phone speaker.
- **Music break at 15.6–16.0.** There is a 0.4 s near-silence (−36 dB RMS) under the purple "Grounded…" field, in the score itself. It looks intentional, but nobody has heard it in context yet.
- **13.40 dissolve.** Someone should watch at speed to confirm it reads as soft rather than as a blink. The numbers suggest soft.
- Nobody has listened to the full mix yet. By eye (contact sheets and strips), the picture has held benchmark level since r5.

## Verdict: SHIP
r8 found one measured fail, and v10 fixes it. The optional dip fix also landed, with no regressions in picture or sound. Before it goes out, one human listen on a phone speaker should confirm the whoosh level and the 15.6 break. Neither is a measured defect.
