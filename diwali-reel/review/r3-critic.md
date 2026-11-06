# R3 critic: film-v4.mp4

## R2 items
1. **Climax haze**: **PARTLY.** The corners stay indigo (11,6,39) and the flood is gold from 2.6s. But each peony still sits on a grey-lilac disc from 2.2 to 2.5s (centre 61,38,81 rising to 81,55,89, down from 137,94,95). It reads as smoke rather than gold.
2. **Effects mix**: **PARTLY, overcorrected.** Pop 1 went from +12.7 to **+0.8 dB**, so the first burst at 1.9s is now effectively silent. The CORE chime at 3.21s is **+1.1** (it was +0.6). Whoosh 2 (+5.5) and the diya tap (+4.8) are now fixed.
3. **Logo hold**: **FIXED.** ADAM is complete at about 3.9s and the fade starts at 5.15s, so both logos are on screen together for about 1.25s. Colours stay true throughout.
4. **Empty ivory beat**: **STILL PRESENT.** From 5.30 to 5.67s the frame is an unlit bowl, rangoli and a falling dot. That is about 0.37s, against a target under 0.25s.
5. **Footer gap**: **PARTLY.** The logos sit at y 1530–1594 and the diya row starts at 1750, leaving a 156px band (it was 270).
6. Descenders, spark collision and logo wipe: still fixed.

## New defects and regressions
- **N1 (regression):** burst 1 lands silent. The pop at 1.90s is under the music, so the first visual climax has no sound of its own. Pop 2 at 2.17s (+4.0) carries both bursts.
- **N2:** sparkle 2 at 2.18s is +2.2, and the senders tap at 6.76s is +3.5 at its own peak but +0.0 peak-for-peak, so it is borderline.
- No clipping, collisions or recolouring. "Happy Diwali" ink spans y 821–968 with margins of 78 and 75px. All copy is verbatim.

## Measured
| Check | Result | Pass |
|---|---|---|
| Integrated loudness | −16.9 LUFS (music only −17.0) | yes (calm) |
| True peak / LRA | −2.2 dBFS / 1.9 LU | yes |
| Effects vs music, same instant, in band | whoosh 0.20s +4.5; **pop1 1.92s +0.8**; sparkle1 +4.8; pop2 2.17s +4.0; **sparkle2 +2.2**; **chime 3.21s +1.1**; chime 3.51s +3.2; whoosh2 5.25s +5.5; tap 5.68s +4.8; tap 6.76s +3.5 | 3 low |
| 2–8 kHz spikes (10 ms) | ≤ +4.2 dB | yes |
| Longest hold (mean diff <0.2) | 0.35s at 1.43s; 0.23s at 4.78s | yes |
| Empty beat | 5.30–5.67s (0.37s) | no |
| Contrast (settled) | lowest 5.3 ("&" and "brightest ideas"); "From" 8.3; lines up to 17 | yes |
| Logo colour | CORE 12,12,108 / 12,108,252 at 3.45s, 4.5s and 5.15s; ADAM cyan and blue; Softlabs 228,36,36; Ainfinite navy and violet, all matching source | yes |
| Text clipping | none | yes |
| Copy | verbatim; sign-off shown as two logos joined by "&" | yes |

## Needs a human
- Is "Softlabs Group & Ainfinite AI" acceptable as two logos joined by "&"?
- On a phone speaker, does burst 1 feel silent?
- Do the grey discs at 2.2–2.5s read as smoke or as dirt?
- Does the score feel Indian and festive, or generic?
- The end card is static for 3.1s (6.85–10s). Is that a calm hold or a dead hold?

## Verdict: ONE MORE PASS
The picture is premium apart from about 0.3s of grey smoke. The logos and the end card land. Three small fixes remain, two of them in the mix.

1. **Pop 1:** raise it about 4 dB so it sits +4 at 1.92s. Raise the CORE chime at 3.21s about 3 dB and sparkle 2 about 2 dB. Keep 2–8 kHz at or below +4.
2. **Smoke discs:** from 2.2 to 2.5s, tint the burst glow gold (#FFD27A, screen) or drop it below 30% so the disc centre stays under 60,35,80 or warm.
3. **Empty beat:** start "This Diwali…" at 5.45s, or light the diya by 5.5s, so the beat is under 0.25s. Optionally nudge the footer down about 60px.
