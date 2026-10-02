# R6 verify critic: film-v7.mp4

**What changed.** I compared v7 with v6 frame by frame at 60 fps. The only picture change is at 13.28–13.70: the step cards now fade in where they sit instead of rising from below. The music stem is bit-identical to v6. Every other change is in the effects layer.

**Method.** I isolated the effects as film minus music on the lossless v7 stems, and checked the results on the decoded mp4s. Both pairs line up at 0 samples. I measured each event at the effect's own peak: film over music at that instant, using 10, 20, 50 and 150 ms RMS windows. Times below are those effect peaks, so they sit about 0.05–0.15 s later than r5's onset times.

## r5 items
| Item | Status | Evidence |
|---|---|---|
| 1. Bring the UI sounds back | **PARTLY. Overshot into spikes** | The clicks are 10–17 dB louder than in v6, but the gain went into the high end, not the body. Lift at 2–8 kHz, 10 ms: 13.92 +10.3, **14.42 +18.7**, 14.92 +10.3, **16.75 (shield) +15.5**, 19.45 +14.0, 19.65 +10.0, 19.85 +9.7, 25.07 (CTA) +7.9, 24.17 (logo lock) +5.0. The 4–8 kHz lift is +13 to +24 dB at 20 ms. The body (1–2 kHz, 150 ms) is still only +0.2 to +1.3 dB. |
| 2. Trim the whooshes | **PARTLY** | Body lift at 328–657 Hz, 150 ms, v6 → v7: 17.63 6.7 → **4.2** and 15.4–15.6 cluster peak −4.9 dB (fixed). But 5.38 6.4 → **7.2**, 6.48 5.3 → **8.0** (peak +3.5 dB) and 20.46 6.3 → **7.5** all got louder. 13.33 4.8 → 4.5 is roughly unchanged. The tails are now about 8 dB shorter. |
| 3. "Useful output" card clipped at the frame edge | **FIXED** | The card fades in fully inside the frame (13.30–13.40). |
| "Build once." drifts on exit / empty slab 17.70 / S11 ring | Unchanged (minor) | These frames are identical to v6. |

## New defects and regressions
1. **The click spikes from r4 are back, and worse (regression).** Eight UI events exceed the 2–8 kHz ≤ +4 dB cap by 6–15 dB. This is the "ticks spiking 10+ dB … annoying" rejection pattern. The sample has almost no energy at 1–2 kHz, so more gain cannot give it body without giving it spikes.
2. **The step cards double-expose over the fading slab (13.30–13.40, about 6 frames).** v6's cards were opaque and hid the slab. Now the cubes and the slab face show through "Approved sources" and "Check permissions". This is transitional, so it is minor.
3. Nothing else is new. Momentary loudness, film over music, is at most +2.0 LU (at 16.0 s), and short-term is at most +0.3 LU.

## Quality bar (measured)
| Check | Target | v7 | Result |
|---|---|---|---|
| Frozen time | ≤ ~1 s per 30 s; no hold > 0.6 s before the CTA | 1.08 s with diff < 0.1, including 0.25 s of end-card settle; longest pre-CTA hold 0.18 s (8.85) | Pass |
| Loudness | about −16 LUFS (calm); true peak ≤ −1 dBFS | −16.9 LUFS; true peak −4.2 dBFS | Pass |
| Dynamics | 1.5–3+ LU, no dying ending | LRA 3.2 LU; music short-term −14.6 to −15.8 LUFS over 23–26 s | Pass |
| Effects in-band lift | about +3–4 dB, never inaudible | Whooshes +3.1 to +8.0; click body +0.2 to +1.3 | Fail |
| Effects 2–8 kHz cap | ≤ +4 dB | Up to +18.7 dB (10 ms) | **Fail** |
| Text contrast | WCAG AA | CTA 17.9:1; "Ainfinite AI" 8.7:1; chips about 8:1 | Pass |
| Brand background | #F7F8FB | Sampled #F6F7FC | Pass |
| Facts | FACTS.md only | All on-screen words are verbatim; only 13.28–13.70 changed, and its words are in FACTS | Pass |
| Determinism | — | Not tested (no renderer run) | n/a |

**Visual.** Frame 0 is finished, there is no strobe (the largest diffs are the continuous moves at 5.70 and 15.60), and the picture is unchanged from the ship-ready v6 apart from item 2.

**Needs a human ear or eye.** Whether the clicks at 14.42 and 16.75 actually sound harsh on phone speakers (the numbers say they will). Whether the logo lock (24.17) and the CTA press (25.07) are audible but tasteful. Whether the 13.30 fade reads as a deliberate dissolve. No one has listened.

## Verdict: ONE MORE PASS (audio only)
1. **Swap or re-voice the UI click, then re-level it.** Low-pass it at about 3 kHz, or use a softer tap with energy at 0.8–2 kHz. Target a body lift of +2–3 dB and 2–8 kHz ≤ +4 dB at 10 ms. Worst first: 14.42, 16.75, 19.45, 13.92, 14.92, 19.65, 19.85 and 25.07. Keep the logo lock (24.17) about where it is.
2. **Trim the whooshes at 6.48 (−4 dB), 5.38 (−3.5 dB) and 20.46 (−3.5 dB)** to bring their body to about +4 dB. Leave 17.63 and 15.4–15.6 as they are.
3. *(Optional, picture)* At 13.30–13.40, let the slab clear before the cards reach full opacity, or keep the cards opaque.
