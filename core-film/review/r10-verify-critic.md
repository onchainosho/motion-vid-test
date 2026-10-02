# R10 verify critic: film-v11.mp4

**What changed (measured).** I diffed all 1620 frames against v10 at full resolution. Mean abs diff is 0.73/255, and mean RGB is identical to 0.03. Every difference sits on edges; flat fills do not change. Timing has not moved: 863 of 870 moving frames best-match v10 at offset 0. The other 7 (hub, 6.28–7.40) are within 0.1 diff: edge noise, not a shift. Edge sharpness (Laplacian variance) is up a median of 7.5% overall and 25–34% at 2–7 s and 16–20 s. Crops show where it comes from. In v10, the big gradient ring (1.7–2.6, 5.7) and the S11 ring (22.0) had blurred, **stair-stepped edges with upscale blocks about 20 px wide**. In v11 those edges are clean anti-aliased arcs. Text is slightly crisper. The 3D slab (12.0) and the hub mark (7.6) look identical.
**Audio:** the decoded film AAC is bit-identical to v10 (max diff 0.0), and both WAV stems have the same md5 as v10.

## r9 items
| Item | Status |
|---|---|
| Path tap 19.67 level | Unchanged (audio bit-identical) — FIXED holds |
| 13.40 dip | Unchanged. Frame 805 is still near-empty (ink 0/0 at <200 luma); the dissolve frames match within 0.14 diff |
| "Build once." drift, empty slab 17.70, S11 ring | Same timing (17.70 diff 0.09). The S11 ring edge is now cleaner |
| Whooshes soft / 15.6 break | Unchanged; still needs an ear |

## New defects or regressions
None measured. The 0.2 s contact sheet matches v10 shot for shot. The strict still-time count rose from 1.13 to 1.45 s, but all 22 newly still frames sit at a diff of 0.07–0.10 against a 0.1 threshold, so this is cleaner encode noise, not new holds. The longest hold before the end card went from 0.17 to 0.22 s (18.18).

## Quality bar
| Check | Target | v11 | Result |
|---|---|---|---|
| Frozen time | ≤ ~1 s/30 s; hold ≤ 0.6 s | 1.45 s strict (v10 1.13 by the same method); longest 0.22 s; end card 0.25 | Pass (borderline-noise) |
| Loudness | ~−16 LUFS, TP ≤ −1 | −16.9 LUFS, TP −2.8 | Pass |
| Dynamics | LRA 1.5–3+ | 3.2 LU | Pass |
| Effects in-band | ~+4 dB | Identical to v10 (taps +3.0 to +7.8) | Pass |
| 2–8 kHz cap | no 10+ dB | Identical (max +3.5) | Pass |
| Contrast | AA settled | 16.9, 16.5, 16.6, 16.0:1 (v10 16.9, 16.2, 16.5, 16.0) | Pass |
| Background | #F7F8FB | #F6F7FC | Pass |
| Facts | FACTS.md only | No text changed | Pass |
| Determinism | — | Not tested | n/a |

## Better, equal or worse?
**Better.** It fixes an unflagged v10 flaw: stair-stepped edges on the hero ring, the brand mark, on screen for about a third of the film. Nothing else changed.

## Needs a human
- Phone-speaker listen for the whoosh level and the 15.6 music break (carried from r9; the audio is unchanged).
- Watch at full speed to confirm the crisper ring edge doesn't shimmer while it grows and rotates (1.7–2.6, 21–26). By eye in the strips it is clean.

## Verdict: SHIP
