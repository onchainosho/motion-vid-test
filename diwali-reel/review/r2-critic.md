# R2 critic: film-v3.mp4

## R1 defects
1. **"Happy Diwali" descenders**: **FIXED.** The p, p and y are intact, with ink at y 820–969 from 6.6s to 10s.
2. **Muddy climax**: **PARTLY.** The flood is now warm gold: 209,167,124 at 2.8s, then 252,222,159 at 3.0s, with no mauve. But from 2.2 to 2.6s a dusty-rose haze still sits behind the peonies (centre 137,94,95 at 2.3s and 167,117,103 at 2.5s; corners 69,47,57). Both bursts look washed out against it rather than gold on indigo.
3. **Spark through the copy**: **FIXED.** The spark falls into the bowl and lights the diya at about 5.4s. "This Diwali…" starts typing on after that, and they never overlap.
4. **Logo sweep desaturation**: **FIXED.** The logos come in on a clean wipe. CORE navy measures 2,15,103 and the ring 43,111,247 from 3.4s; ADAM measures 7,14,39 / 19,157,235 from 4.0s. The exit at 4.8–5.0s is an opacity fade only.
5. **Near-empty frame**: **PARTLY.** It is now a purposeful beat (the spark lights the diya), but 5.0–5.45s is still ivory, rangoli lines, an unlit bowl and a dot. It lasts about 0.45s, longer than v2's 0.17s.
6. **Effects buried**: **PARTLY.** It is now uneven instead of quiet. Pop 1 is too hot and the chime, whoosh 2 and diya tap are still under the music (see table).
7. **Wasted space / still hold**: **FIXED.** The diya row fills the bottom 120px throughout, and the logos push in slowly. The longest hold at R1's threshold is 0.35s.

## New defects and regressions
- **N1, pop 1 at 1.88s:** it is +12.7 dB over the music in its band, and its stem peaks at −4 dBFS. It is the loudest moment of the reel and may sound jarring.
- **N2, short logo hold:** CORE and ADAM are both complete only from about 3.9 to 4.8s (about 0.9s) before they fade. That is a tight read for the two products the reel is meant to showcase.
- **N3, footer gap:** the logo row ends at y≈1510 and the diya row starts at y≈1780, leaving a 270px empty band under the brand sign-off.
- No clipping, collisions or recolouring found. All copy is verbatim. The Ainfinite logo is unaltered (navy 13,24,78 vs source 10,24,80; violet 132,46,235 vs 124,38,245).

## Measured
| Check | Result | Pass |
|---|---|---|
| Integrated loudness | −16.9 LUFS (music only −17.0) | yes (calm) |
| True peak | −2.1 dBFS | yes |
| LRA | 1.9 LU | yes (calm) |
| Momentary loudness | −15.6 at 2.5s; −19.4 at 3.0s; −19.8 at 5.0s; −21.2 at 9.5s | music dips at the reveal |
| Effects vs music (in band, 50ms peak) | whoosh 0.17s +4.3; pop1 +12.7; pop2 +4.9; sparkle 2.43s +3.8; chime 3.23s **+0.6**; 3.48s +3.9; whoosh2 5.03s **+2.1**; diya tap 5.43s **+1.6**; 6.67s +5.5 | mixed |
| 2–8 kHz spikes | ≤ +6.9 dB | yes (<10) |
| Longest hold (mean diff <0.2) | 0.35s at 1.45s | yes |
| Contrast | spark line 13.5, world 16.9, Diwali line 17.1, brightest 5.3, Happy Diwali 5.1, From 8.4, & 5.3 | yes |
| Logo colour, during and after reveal | CORE, ADAM, Softlabs (225,40,47 vs 228,29,37) and Ainfinite all true | yes |
| Text clipping | none; Happy Diwali margins 71/68px | yes |
| Copy | verbatim; the sign-off line is set as the two logos | yes |

## Needs a human
- Is it acceptable that "Softlabs Group & Ainfinite AI" appears as two logos joined by "&" rather than as set text?
- Is pop 1 exciting or startling on phone speakers?
- At phone size, do 2.2–2.6s read as warm smoke or as dirty haze?
- Is about 0.9s enough to register CORE and ADAM?
- Does the score feel festive and Indian, or generic?

## Verdict: ONE MORE PASS
The picture is now close to premium. The flood, the logo fidelity and the end card all land. What holds it back is the climax haze and an uneven effects mix.

1. **Haze:** keep the sky indigo (corners at or below 30,15,60) until about 2.6s. Hold the warm haze layer at 0 until the flood, or tint it gold (#FFD27A) with `screen` rather than a dusty-rose overlay.
2. **Effects mix:** cut pop 1 by about 8 dB. Raise the chime at 3.2s by about 4 dB, and whoosh 2 and the diya tap by about 3 dB. Fill the music dip at 3.0s and 5.0s with a bell or swell.
3. **Timing:** hold CORE and ADAM together until about 5.2s (≥1.3s complete). Start the greeting line at 5.25s so the empty ivory beat is under 0.25s. Optionally move the footer down by about 120px to close the gap above the diya row.
