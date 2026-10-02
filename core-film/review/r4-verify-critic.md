# R4 verify critic: film-v5.mp4

v5 fixes the worst picture problem: the purple strobe at 15.40 is gone. The stack callouts are re-laid, the ring hub is clean and the end card now fills the frame. The clicks are still the weak point. Only two of them came down, and four still spike more than 10 dB over the music at the same instant.

## r3 items
| Item | Status | Evidence |
|---|---|---|
| Purple strobe 15.40–15.48 | FIXED | The "Useful output" card fills purple at 15.37, then grows in one continuous move over 15.40–15.67. The largest frame diff in the window is 37, down from 171. The purple is empty only from 15.67 to 15.73, and "Grounded…" starts typing at 15.73. |
| Stack callouts collide | FIXED | At 12.4 the three cards span y 740–858, 916–1032 and 1100–1210, with gaps of 58 and 68 px and no overlap. They sit 61 px from the right edge, a hair under the 64 px asked for. |
| Ring hub lines through the hole (8.5–10) | FIXED | At 9.0 the connectors stop at the ring's outer edge, and the hole is clean. |
| Clicks, 2–8 kHz (dB over the music-only render at the same instant) | PARTLY | 3.55 went from +16.6 to +6.6 and 6.05 from +14.7 to +7.0 (fixed). 16.70 went from +16.0 to +11.0. These barely moved: 9.60 (+15.7), 14.45 (+14.7), 19.45 (+13.9) and 19.75 (+12.9, up from +12.2). |
| Clicks, above 8 kHz | PARTLY | 3.55 dropped 10 dB, to +16.3. These are still high: 16.70 +27.3, 14.45 +22.2, 9.55 +20.5, 19.45 +18.3. |
| "Build once." drifts on exit (13.2–13.43) | PARTLY | It still rises about 6 px while fading, but it no longer reaches the top edge. Minor. |
| Step cards slide over "SHARED INTELLIGENCE FOUNDATION" (13.30–13.40) | STILL PRESENT | "Ground & validate" and "Useful output" pass over the label and the slab's cubes for about 6 frames. |
| Empty slab (17.70–17.83) | STILL PRESENT | The shrinking purple card is empty for about 0.13 s while the headline types. It reads as a morph, so this is minor. |
| Near-empty 10.18–10.22 | FIXED | The slab arrives with "Build once." |
| End card's bottom 30% empty | FIXED | The content now runs to y≈1710. The chips "SSO / RBAC / Audit Logs / Data Privacy / Scalable" are legible (cap height about 30 px). |
| Scene 11 ring about 40% of the width | PARTLY | It is now about 47% at 22.5. |
| Mono labels | PARTLY | "YOUR BUSINESS" is still about 28 px tall. That is unchanged, and acceptable. |

## New defects and regressions
1. **"Build once." flies through the outgoing scene (10.08–10.20).** The small headline rises across the fading ring and over the "AI Products / Assistants" chips before it settles. It is a transitional text collision, and it is visible at phone size.
2. **The ring flies alone across the frame (23.60–23.70).** Only the ring and a half-entered "C … R" are on screen. It reads as a carried object into the wordmark, so this is acceptable and not a defect.

No other regressions were found.

## Measured
- **Film loudness:** −16.9 LUFS, LRA 3.2 LU, true peak −4.2 dBFS.
- **Music-only loudness:** −17.0 LUFS.
- **Broadband excess over the music:** at most +4.7 dB, at 5.35. In-band, the remaining clicks sit at about the level of the music's own local transient peaks (within ±1.5 dB, except +4.4 at 25.1). But between beats they spike 13–16 dB over the music.
- **Strict 60fps still check:** the longest hold before the end card is 0.27 s (18.18). Total frozen time before the end card is 0.94 s. The end card has slow drift.
- **Transitions:** 1.5–1.85, 3.40, 5.58–5.78, 6.5–6.9, 13.28–13.47, 15.55–15.67 (clean), 17.6–17.85. No frame-diff spikes.
- **Contrast:** "Ainfinite AI" on the end card is about 8:1, and the CTA is white on #5F00A6.
- **Facts check:** every on-screen word matches FACTS.md, including the steps "01/04/06" (a subset), "Your data / Private model", "YOUR CONTROLLED ENVIRONMENT" and the chips. There are no numbers or claims.
- **Frame 0** is a finished composition.

## Verdict: ONE MORE PASS
The picture now holds up next to a premium launch film. The audio still fails the quality bar's "no 10+ dB click spikes" rule at four events, after this was requested in two passes.

1. **Attenuate the clicks still over the bar:** 9.60, 14.45, 16.70, 19.45 and 19.75. Use about −10 dB at 2–8 kHz and −12 dB above 8 kHz, or swap in a softer sample. The target is ≤ +4 dB in the 2–8 kHz band against the music-only render at the same instant. The approach that worked at 3.55 and 6.05 shows it can be done.
2. **Hold "Build once." until the outgoing chips are gone, or enter it from below the slab (10.08–10.20)**, so it never crosses the ring or the chips.
3. **Delay the step-card rise by about 0.1 s, or fade "SHARED INTELLIGENCE FOUNDATION" out first (13.30–13.40).**
