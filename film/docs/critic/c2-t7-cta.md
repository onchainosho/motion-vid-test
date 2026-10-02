# C2 critic: tip 7 → CTA (17.1–30.0)

Evidence is in /tmp/critic-c2/. The paper drift sets a frame-diff floor of about 0.4.

## Tip 7 (17.5–20.0): KEEP (polish)
1. **Handoff works.** At 19.60 TEST 01 lifts out and leaves a hole in the strip. At 19.86 the photo is alone, and from 20.00 to 20.03 the bezel draws around the same pixels.
2. **Annotations pop off.** At 19.60 the orange circle, ✓, TEST 01 tape and THEN CONTINUE tape vanish in one frame.
3. **Strip breaks the clamp.** It spans x 51–1028.
4. **Top-right is empty.** x 540–1000, y 220–680 is bare paper.

## Tip 8 (20.0–22.5): REVISE
1. **Phone too small (centre).** About 415×710 px, roughly 23% of the usable frame, with about 330 px of bare paper on each side. Not a "close-up".
2. **Weak cause → effect.** The rough take becomes the styled shot through a light sweep (21.45–21.7). Nothing shows the recording teaching Seedance, which slide 09 does.
3. **Near-freeze, 21.75–22.25.** Diff 0.17–0.3, below the drift floor.
4. **Stale screen, 20.0–20.45.** The screen still shows the car, and the REC dot waits until 20.5.

## Checklist (22.5–26.5): KEEP
**Measured**
- Ticks at 23.317 … 25.067, exactly 0.25 s apart.
- Row pitch 80 ±1.5 px; label left edges x 500–503.
- Nothing below y 1513.

**Defects**
1. **Stamp under the sheet, 25.37–25.43.** The oversized "THEN GENERATE." passes under the sheet's torn edge.
2. **Small row labels.** About 30 px cap height, small for a screenshot.
3. **Final hold.** 25.7–26.15 shows only the underline draw. Acceptable.

## CTA (26.5–30.0): REVISE (light)
**Measured**
- Readable from 26.6 to 30.0 (3.4 s).
- The 2% push is real (ink x 63–1016 → 54–1025).

**Defects**
1. **Logo is not faithful (y 1030–1430).** Rays are 3–4× too thick and too long, the sun is flat instead of a gradient, and the sun's top sits about 30 px below the L's top.
2. **Lower half is sparse.** Only a thin arrow and a thin mark.
3. **Push overshoots.** The FOLLOW box reaches x 1025, into the right zone.
4. **Word-soup headline swaps (20.00, 22.45, 26.47).** Mixes such as "MOTION? / UP? … NEW / US" for about 0.1 s each. Glyphs don't overlap, and the counters double-print.

## Top 3 fixes
1. **Tip 8 as slide 09.**
   - A 3-frame ROUGH TAKE strip at x 64–420 (frames at 20.5, 20.75, 21.0).
   - An orange arrow with a "SEEDANCE 2.5" tag.
   - The phone at about 460×820 (x 520–980, y 700–1520), with the styled shot resolving at 21.5.
   - A 3% push from 21.7 to 22.3; the walk starts at 20.1.
2. **Rebuild the logo SVG.**
   - Ray stroke ≈ 0.02 L, length ≈ 0.07 L, with a gap from the disc.
   - Sun gradient #EC6327 → #F4A57A; sun top aligned to the L top.
   - A lockup about 300 px wide with an ink "POSSIBLE LABS" wordmark, filling y 1050–1500.
3. **Clamps and exits.**
   - Scale the CTA 0.98 → 1.00, not 1.00 → 1.02.
   - Narrow the strip by 40 px.
   - Fade the annotations over 19.50–19.60.
   - Delay incoming headline lines 4 frames.
   - Put the stamp above the sheet.
