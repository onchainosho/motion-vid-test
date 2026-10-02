# R7 verify critic: film-v8.mp4

**What changed.** I compared v8 with v7 at 60 fps and checked the picture with my own diffs. Frames match everywhere except 13.28–13.75. The music stem `_mix-music-only-v8.wav` has the same md5 as v7. I isolated the effects as film minus music on the lossless stems, found each effect's onset in the effects stem (5 ms envelope), then measured film over music at that effect's own peak. Window lengths are given with each number.

## r6 items
| Item | Status | Evidence |
|---|---|---|
| 1. Re-voice and re-level the click | **PARTLY** | The spikes are gone. The tap is re-voiced to a centroid of about 600 Hz. 2–8 kHz lift at 10 ms is ≤ +4.4 dB on every tap (r6 measured up to +18.7). Body at 400–1000 Hz, 50 ms: 3.59 +4.0, 6.04 +5.2, 9.64 +6.5, 14.44 +3.1, 14.94 +2.5, 19.22 +5.4, 24.19 +6.2, 25.09 +7.8. **But the path taps are now near-inaudible: 13.94 +1.5, 19.47 +1.1, 19.67 +0.3, 19.87 +1.7** (+0.1 to +0.9 at 150 ms). The chime at 16.42 is on the shield-check draw and measures +5.4 at 2–8 kHz over 10 ms, slightly over the cap. |
| 2. Trim the whooshes at 5.38, 6.48 and 20.46 | **FIXED (slightly low)** | 328–657 Hz at 150 ms: 5.36 +2.0, 6.46 +2.1, 20.44 +2.0 (v7: 7.2 / 8.0 / 7.5). All whooshes now sit at +1.1 to +3.9 in that band, and the fx peak is 3–10 dB under the music peak. Momentary loudness, film over music, is at most +0.5 LU (r6: +2.0). |
| 3. Slab and cards at 13.30 (optional) | **PARTLY, with a regression** | The slab now fades first (13.28–13.38), which is good. But the cards **cut in within one frame** at 13.40 (frame 804): text ink goes from 0 to about 90% of its final value. They then rise about 90 px, and **the "Useful output." text sits in the bottom 30 px rows at 13.40–13.43 (frames 804–806)**. The frame edge clips it, which brings back r5 item 3. At 13.40 a faint slab ghost also shows behind "Approved sources". |
| "Build once." drift, empty slab at 17.70, S11 ring | Unchanged (minor) | Pixel-identical to v7. |

## New defects
- Defect 3 above is the only picture regression. Nothing else changed.
- True peak rose to −2.8 dBFS (v7: −4.2). That still passes.

## Quality bar (measured)
| Check | Target | v8 | Result |
|---|---|---|---|
| Frozen time | ≤ ~1 s per 30 s; no pre-CTA hold > 0.6 s | 0.57 s with diff < 0.1 (270×480 mean abs); the only run ≥ 0.13 s is the 0.17 s end-card settle at 26.83 | Pass |
| Loudness | about −16 LUFS; TP ≤ −1 | −16.9 LUFS; TP −2.8 dBFS | Pass |
| Dynamics | LRA 1.5–3+; no dying end | LRA 3.2; short-term −14.5 (25 s), −15.7 (26 s) | Pass |
| Effects in-band | +3–4 dB, never inaudible | Whooshes +1.1 to +3.9; taps +0.3 to +7.8 (50 ms); 4 path taps under +2 | **Fail (4 events)** |
| 2–8 kHz cap | ≤ +4 dB | Taps ≤ +4.4; chime +5.4 | Marginal pass |
| Contrast | WCAG AA | End card pixel-identical to v7 (CTA 17.9:1 per r6) | Pass |
| Background | #F7F8FB | Corners #F2F4F7–#F4F6FA (vignette) | Pass |
| Facts | FACTS.md only | Only 13.28–13.75 changed. Its words (the 4 steps, "Useful output. Human control.", "Follow the context. Understand the controls.") are verbatim from FACTS.md | Pass |
| Determinism | — | Not tested | n/a |

**Needs a human ear or eye:** whether the whooshes at about +2 dB still read on a phone speaker; whether the path taps at 13.94 and 19.47–19.87 are heard at all; whether the 13.40 pop reads as a cut. No one has listened.

## Verdict: ONE MORE PASS (two small fixes)
1. **Fix the 13.40 card entry.** Fade the cards over at least 8 frames, starting after the slab has fully cleared. Either drop the rise or start it at an offset that keeps the "Useful output." card ≥ 40 px inside the bottom edge in every frame. v7's in-place fade, started at 13.40, would do it.
2. **Raise the path taps at 13.94, 19.47, 19.67 and 19.87 by about 2.5–3 dB**, to about +4 dB body at 50 ms. The new tap's energy sits at about 600 Hz, so this keeps 2–8 kHz at ≤ +4.
3. *(Optional)* Bring the chime at 16.42 down about 1.5 dB at 2–8 kHz. If a listener calls the whooshes faint, raise those at 1.71, 10.22, 5.36 and 6.46 by about 1.5 dB.

Apart from these, the film would sit next to the benchmark: the picture was signed off as ship-ready in r5 and r6, and the mix is now clean.
