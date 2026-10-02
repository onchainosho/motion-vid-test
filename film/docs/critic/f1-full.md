# F1 full critique — v1.mp4 (30.0 s)

Evidence: /tmp/critic-f1/ (sheet/ 0.2 s contact sheets, native/, dense/ 1/30 s windows, diff.txt, full.wav, mus.wav).

## 1. Scenes

The empty-frame figure is the share of the usable area (x 64–1000, y 200–1560) that is bare paper on a settled frame.

| # | Time | On screen | Empty | Could lose | Problems, worst first |
|---|---|---|---|---|---|
| Cover | 0–2.5 | Headline, SEEDANCE 2.5 box, film fan, polaroid, coins | 35% | 0.5 s | Nothing moves from 1.5 to 2.0 s (diff 0.29, the drift floor). The fan never really "spreads". The visual sits in the left 45%. The SEEDANCE box reaches x=1015, inside the right UI rail. |
| Tip 1 | 2.5–5.0 | Pixelated desert polaroid, CHECK icons, final render | 30% | 0.25 s | Freeze at 4.23 (0.33 s). Small CHECK strip. The draft→final resolve is the best beat in the film but it is undersized. |
| Tip 2 | 5.0–7.5 | 6 photos land, then a 3×2 pack | 18% | 0.5 s | Pack is settled and inert from 6.3 to 7.0. Headline is small (two 55 px-cap lines against the slide's hero type). |
| Tip 3 | 7.5–10.0 | Grey-box street, orange path, wipe to city car | 37% | 0 | Strong idea, but it sits in a polaroid at 40% scale. It is not the "wide 3D" shot. |
| Tip 4 | 10.0–12.5 | Ball on a dashed line, 3 to 4 small polaroids | 39% | 0.5 s | No squash and no box dip, so the cause→effect is weak. Messy scatter. 11.67 s is still for 0.27 s. Ball and wind photo exit through the footer. |
| Tip 5 | 12.5–15.0 | Station photo, waveform, playhead, tags | 28% | 0.25 s | Unlit tags fail contrast for about 1 s. Waveform runs to x=1000 at y≈1400, under the Reels rail. |
| Tip 6 | 15.0–17.5 | Arrows, 3 cards, YOUR LLM, prompt sheet | **57%** | 0.5 s | Emptiest scene. The cards are tiny. "YOUR LLM" ghosts over the sheet header at 16.0. Still from 16.73 for 0.43 s. |
| Tip 7 | 17.5–20.0 | Contact sheet, TEST 01, circle, ✓, fill | 24% | 0.25 s | Fine. Same scale as everything else. |
| Tip 8 | 20.0–22.5 | Rough-take strip, phone, styled shot | 26% | 0 | Good carry-in. Phone and STYLED SHOT reach x≈1000. |
| Checklist | 22.5–26.5 | 8 rows tick, THEN GENERATE. | 36% | 0.25 s | No sound on any tick or on the stamp. The orange row numbers are 3.1:1. |
| CTA | 26.5–30.0 | LIKE THIS EXPLAINER?, FOLLOW box, logo, arrow | **49%** | 0.75 s | Only the paper drift moves from 27.2 to 30.0 (2.8 s). The box reaches x=1013. Lower 40% is bare. |

## 2. Layout and transition defects

- **One layout, ten times.** Every tip uses the same headline top-left, box below and a mid-scale visual in y 650–1530. Every change runs the same split-headline exit, an empty box and opposite-side entry. This fails "scale varies, no repeated layout" and reads as a templated slideshow. Except for the orange fill at 2.4 s, there is no close-up, no full-bleed shot and no type-impact frame.
- **Empty orange box**, about 0.1–0.17 s each, at 4.83, 9.83, 12.33, 14.83, 17.33, 19.83, 22.33 and 26.33. A textless orange bar on bare paper.
- **Near-empty frames** at 12.33–12.45 (lone ball plus empty box) and 26.33–26.45 (empty box, checklist sliding off).
- **Objects flying through text:**
  - 7.20–7.47: pack photos fly up through the header, the outgoing headline and the incoming "BLOCK IT FIRST." box.
  - 17.33–17.47: the prompt sheet lifts through the headline and box.
- **Clipped text:**
  - 2.43–2.53: "480p" is cut by the orange band.
  - 5.0–5.3: the split headline is cut by the frame edges, and the two halves sit on different lines.
- **Safe zone.** Ink reaches x 1013–1015 on the cover box, CTA box and checklist, against the 940 limit. The storyboard's x≤1000 clamp itself breaks the 140 px rule. The bottom is fine: lowest key content is y 1559.
- **Persistent actor is nominal.** The box stays parked top-left and only resizes. It becomes the transition once, at 2.5. The real handoffs are 5.0 (polaroid), 15.0 (line→arrows) and 20.0 (TEST 01→phone).
- **Beat grid is OK.** Every scene change is on the 0.5 s grid and every whoosh lands at the change −0.05 s. But it is metronomic: 8 × 2.5 s with the same move each time.

## 3. Measured

| Metric | Value | Verdict |
|---|---|---|
| Frozen time, strict (YAVG<0.2) | 1.83 s total; longest 0.37 s (29.63) | Passes only because the paper drift masks it |
| Frozen time, drift-only (YAVG<0.5; drift floor ≈0.3–0.4) | 7.3 s total; longest 2.8 s (27.2–30.0); others 1.53 (0.47 s), 4.23 (0.33 s), 16.73 (0.43 s) | **Fail** in spirit |
| Integrated loudness | −15.4 LUFS (music-only −15.5) | 1.4 LU under the −14 punchy target |
| True peak | −4.5 dBTP | No clipping; 3.5 dB of headroom wasted |
| LRA | 2.4 LU | Flat for a punchy cut (target ≥3) |
| SFX vs music | Whooshes 2–10 dB under the music broadband. The SFX residual is −36 dB RMS against −17 for the music, and moves integrated loudness by 0.1 LU | Effects are never louder, but mostly inaudible |
| SFX 2–8 kHz | Clicks at 0.55, 3.3 and 8.3 sit 40+ dB over the music in that band (−38 dB absolute) | Bare clicks |
| Music spectrum | 0.4% of energy above 2 kHz | Muffled on phone speakers |
| Unsounded events | 8 checklist ticks (23.3–25.05) and the THEN GENERATE stamp (25.4) | Missed sync |
| Box cream on orange | 3.01:1. Box text is ≥55 px caps, bold | Allowed exception, large |
| **Worst contrast** | DIALOGUE tag (unlit grey) 2.84:1; AMBIENCE 4.19:1 settled about 1 s; checklist orange numbers 3.09:1 | Fail |

## 4. Top 8 changes

1. **Break the template.** Give at least 4 scenes their own scale:
   - Tip 1: a full-bleed desert photo, with the headline on a paper strip.
   - Tip 3: the 3D street full-frame, with the camera dropping in before the wipe.
   - Checklist: a type-impact punch-in on "THEN GENERATE."
   - CTA: the box fills 85% of the width.
2. **Kill the empty-box state.** Morph the box with a masked text roll: old text exits up and new text enters from below while the box resizes, so there is never an empty bar. Let the box move and resize to each scene's layout instead of parking at (64, ~430).
3. **Enlarge the type to slide scale.** Raise the 132 px headline cap to about 260 px and fill 876 px of width. Put the box beside or over the visual as slide 02 does.
4. **Re-route exits away from text.** The 7.2 pack and the 17.33 sheet should exit downward or sideways under a mask after the incoming title. Hold the incoming title until the path is clear.
5. **Clamp key content to x ≤ 940.** This covers the cover box, CTA box, checklist rows, waveform and phone. Fix the storyboard clamp too.
6. **Fill dead space and dead time.**
   - Tip 6: cards at 3× size, and the sheet from x 64 to 940.
   - Tip 4: rebuild the slide's 2×2 with the PHYSICS + MOTION hub, plus a ball squash and box dip.
   - CTA: a real 4% push, an arrow redraw and a ray pulse. Cut 0.5 s and give it to the checklist.
   - Remove the near-still windows at 1.5, 4.23, 6.3, 11.67 and 16.73.
7. **Audio pass.**
   - Add a soft tick on each checklist row and a stamp hit at 25.4.
   - Add a high layer (hats or shaker) to the music.
   - Lift the mix to −14 LUFS with a −1 dBTP ceiling.
   - High-pass or shorten the clicks at 0.55, 3.3 and 8.3 so they sit about +4 dB in band, not +40.
8. **Contrast.** Unlit tags should use ink text at 0.5 opacity on a darker tag, or start lit. Make the checklist numbers ink, or orange #C24E17 (4.5:1).

## 5. Verdict

**ONE MORE PASS.** The parts are good: brand match, beat-locked cuts, three real handoffs, and a clean checklist. The film is still one layout repeated ten times. It also has empty-box frames, objects flying through text, safe-zone overruns, inaudible SFX and a 2.8 s CTA where only the paper moves. It does not yet stand next to a premium launch film.
