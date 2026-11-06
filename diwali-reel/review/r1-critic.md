# R1 critic: film-v2.mp4

## Per-beat
- **0–2s rockets:** Frame 0 is finished, line readable (14.2:1). But the rockets are ~10px specks rising through a mostly empty sky for 1.9s. Thin for a hook.
- **1.9–2.6s bursts:** Burst 1 is clean against the dark for about 0.3s. From 2.3s a taupe haze (sky sampled at 131,95,78) flattens both peonies. The climax reads as smog, not gold.
- **2.6–3.2s flood:** Cold grey-white blurry orbs with mauve edges (149,119,130 at 3.0s). It looks like lens fog, not warm light.
- **3.2–5.0s CORE/ADAM:** Settled colours are true. The "sweep" turns the logos grey and beige until about 4.1s. The logos then sit still (bbox y within 5px from 3.6 to 4.8s), and the bottom third is empty.
- **5.0–10s greeting:** The final layout is good and all contrast passes. Defects 1, 3 and 5 below.

## Ranked defects
1. **"Happy Diwali" descenders cut off** (p, p, y sliced at the baseline), 6.6–10.0s. This is the final read.
2. **Muddy climax:** taupe haze, then grey and lavender blobs, 2.3–3.2s. Not warm gold.
3. **Falling spark and trail pass through "This Diwali, may your"** as it types on, 5.23–5.37s.
4. **Logo sweep desaturates the logos:** ADAM "A" measured (121,116,109) against true (1,10,36) at 4.0s; CORE "C" grey at 3.5s. It reads as recolouring.
5. **Near-empty frame** (ivory, an empty bowl and a dot), 5.03–5.20s.
6. **Effects buried:** 7 of 10 effects are at or below the music in their own band. Chimes, the diya tap, sparkles and the second whoosh are inaudible. Momentary loudness falls at the reveal (−21 LUFS at 4.0s, −15.4 at 2.5s).
7. **Wasted space:** content ends at y≈1290 in the logo beat and y≈1520 in the greeting. Near-still 4.07–4.74s (0.67s; only glitter moves).

## Top 5 fixes (code)
1. On the "Happy Diwali" element, remove `overflow:hidden` from its clip or mask wrapper, or add `padding-bottom:0.3em` and `line-height:1.25`.
2. **Flood:** replace the white radial blobs with a warm gradient (#FFD27A → #FFF4E2) using `mix-blend-mode:screen`. Keep the haze layer at 0 until 2.6s so the sparks stay crisp on indigo. Use a radial mask with a hard edge so the mauve band lasts under 0.15s.
3. Delay greeting line 1 until 5.40s, or move the spark's x-path outside the text bbox (x 180–900, y 360–600).
4. **Logo sweep:** keep the logos at full opacity and full colour. Add a separate gold highlight band over them (`mix-blend-mode:plus-lighter`, ≤30% opacity). Never filter or fade the logo itself to show light.
5. Overlap the logo exit with the greeting entry: rangoli and the diya glow from 4.85s, line 1 from 5.0s. Also raise the chime, tap and sparkle gains by about 5 dB, and add a 3s music swell or bell under the reveal.

## Measured
| Check | Result | Pass |
|---|---|---|
| Integrated loudness | −16.9 LUFS (music only −17.0) | yes (calm) |
| True peak | −1.9 dBFS | yes |
| LRA | 1.4 LU | marginal |
| Effects vs music (in band, 50ms peak) | whoosh +1.9, pop1 +5.8, pop2 +2.0, sparkles 0/−4.5, chimes −1.3, whoosh2 −4.5, taps −5.1/−4.0 dB | under-lifted |
| 2–8 kHz spikes | ≤ +0.4 dB | yes |
| Longest hold | 0.67s at 4.07s (mean diff < 0.2) | marginal |
| Contrast | spark line 14.2, world 17.0, Diwali line 17.3, brightest 5.3, Happy Diwali 6.0, From 8.5, & 5.3, Ainfinite 17.1 | yes |
| Logo colour (settled) | CORE navy 0,14,97 vs 1,17,103; ring 0,137,254 vs 1,141,253; ADAM 1,10,35 / 3,204,252 vs 0,9,36 / 0,204,250; Softlabs red 227,29,37 = 229,29,37 | yes |
| Logo colour (sweep, 3.2–4.1s) | grey and beige wash | no |
| Copy | verbatim | yes |

## Needs a human
- Does the score feel festive and Indian enough, or generic?
- What do the effects sound like once they are audible?
- At phone size, does the flood read as warm light or as fog?

**ONE MORE PASS**
