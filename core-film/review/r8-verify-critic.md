# R8 verify critic: film-v9.mp4

**What changed.** I diffed v9 against v8 at 60 fps (270×480, mean abs). Only frames 804–825 (13.40–13.75) differ. The music stem's md5 matches v8 (a88dd58…). I took the effects stem as film minus music on the lossless WAVs. For each event I found the peak in the effects stem's own band, then measured film over music in that window. v9 changed the effects at 1.6–1.9, 5.25–5.57, 6.35–6.67, 10.11–10.43, 13.85–13.95, 16.41–16.48 and the three path taps at 19.38–19.88.

## r7 items
| Item | Status | Evidence |
|---|---|---|
| 1. 13.40 card entry | **FIXED** | The cards now fade in place over about 8 frames (13.47→13.60, ink 0→90%) and don't rise. The lowest ink sits at row 1762, so "Useful output." clears the bottom edge by **157 px** in every frame (r7: under 30). No slab ghost. Small leftover: the slab is gone by 13.40, and the cards only start at 13.45. **13.40–13.43 (frames 804–806) holds almost no ink** (min luma ≥ 220), a dip to background lasting 3 frames. It reads as a dissolve, not a hold. Minor. |
| 2. Raise path taps +2.5–3 dB | **PARTLY** | Each tap's level in the effects stem went up exactly +3.0 dB. Body at 400–1000 Hz over 50 ms: **13.94 +6.0, 19.47 +4.2, 19.87 +5.9 — fixed. 19.67 +0.1 — STILL PRESENT.** That tap's source is 6.5 dB below its siblings (−23.7 vs −17.2 dBFS band peak), and the music peaks right there (fx − music = −4.3 dB). So the four-card tap run plays as tap, tap, (nothing), tap. |
| 3a. Chime 16.42 2–8 kHz | **FIXED** | Over 10 ms: +3.9 (v8 +5.0). |
| 3b. Whooshes +1.5 dB | **FIXED (as asked)** | 1.71, 5.36, 6.46 and 10.22 each went up +1.5 dB in the effects stem; 20.44 is unchanged. The film's RMS over the music, 500 ms window at 328–657 Hz: +0.6 / +1.1 / +0.8 / +0.5 / +0.6. Whoosh peaks sit 5–11 dB under the music peak. They are deliberately soft. |
| "Build once." drift, empty slab 17.70, S11 ring | Unchanged | Pixel-identical to v8. |

## New defects or regressions
- No picture regressions outside 13.40–13.75. The 0.2 s contact sheet is identical to v8 elsewhere.
- No new audio spikes. The taps' 2–8 kHz lift is ≤ +1.5 dB at 10 ms (centroid 578 Hz). True peak, integrated loudness and LRA haven't moved.

## Quality bar (measured)
| Check | Target | v9 | Result |
|---|---|---|---|
| Frozen time | ≤ ~1 s per 30 s; hold ≤ 0.6 s | 0.57 s total; the longest run is the 0.17 s end-card settle at 26.82 | Pass |
| Loudness | ~−16 LUFS, TP ≤ −1 | −16.9 LUFS, TP −2.8 dBFS | Pass |
| Dynamics | LRA 1.5–3+, no dying end | LRA 3.2 (−17.9/−14.8); M −16.1 at 24.9 | Pass |
| Effects in-band | ~+4 dB, never inaudible | Taps +3.5 to +10.9 (50 ms); **19.67 +0.1** | **Fail (1 event)** |
| 2–8 kHz cap | not 10+ dB spikes | Taps ≤ +1.5, chime +3.9 | Pass |
| Contrast | WCAG AA, settled text | 13.9 path cards: 16.8:1 (card 1), 10.2:1 ("Useful output." on lavender), headline 16.3:1; end card unchanged (17.9:1) | Pass |
| Background | #F7F8FB | Card field bg (246,247,252) = #F6F7FC | Pass |
| Facts | FACTS.md only | The changed window's words ("Follow the context. Understand the controls.", Approved sources, Check permissions, Ground & validate, "Useful output. Human control.") are verbatim | Pass |
| Determinism | — | Not tested | n/a |

## Needs a human ear or eye
- Nobody has listened yet. I can't measure whether the whooshes, which are inaudible by meter (+0.5 to +1.1 dB), feel present or just absent on a phone speaker. If someone hears them as missing, that's fine for a calm film.
- Whether the 3-frame dip at 13.40 reads as a soft dissolve (my guess) or as a blink.
- On the eye side, the picture has held at benchmark level since r5. This pass fixed the last framing defect.

## Verdict: ONE MORE PASS (audio only, one line)
1. **Raise the path tap at 19.67 by about 7–8 dB** to match its siblings (about −17 dBFS band peak in the effects stem, which gives ≥ +4 dB body over music at 50 ms). It is the only measured fail. The tap's energy sits at 578 Hz, so this won't break the 2–8 kHz cap. No new picture render or picture re-review is needed.
2. *(Optional)* Start the card fade 2–3 frames earlier (about 13.40) so it overlaps the slab's tail and closes the 13.40–13.43 dip.

With fix 1 in place, I would sign SHIP. The picture and the rest of the mix already sit next to the benchmark.
