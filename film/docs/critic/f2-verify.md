# F2 verify: v2.mp4 compared with v1

Evidence is in /tmp/critic-v2/: sheet/ (contact sheets every 0.2 s), native/, dense/ (1/30 s windows), diff_v1.txt and diff_v2.txt, natgrid.png and crop_tags.png. I measured v1 and v2 with the same method.

## 1. Previous top 8 and named defects

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Break the template | **PARTLY** | Tip 1's final render now runs edge to edge (x 0–1080, 4.0–4.6). Tip 3 is full-width, with a camera drop-in and a diagonal wipe to the city car at 9.1. Tip 6's sheet now spans x 64–960. The CTA box is about 88% of the width. But every tip still uses the same layout: headline top-left, box under it, visual below. No shot is truly full-bleed. The only type-impact frame is the THEN GENERATE. slam (25.2–25.5), and it lands at about 70 px. |
| 2 | Empty-box state | **FIXED** | A masked text roll now runs at 7.43, 12.43, 15.25, 17.45, 19.95, 22.45 and 26.45, so there are no textless bars. **But** the lone box still sits on bare paper for 0.07–0.15 s at 12.40, 14.80, 17.40, 19.80, 22.45 and 26.47. The box still parks top-left. |
| 3 | Type at slide scale | **PARTLY** | Headline caps went from 93 to about 121 px (+30%). Tip 2 is unchanged at 62 px per line, and it is the weakest title. The target was about 260 px. |
| 4 | Exits away from text | **FIXED** | The 7.2 pack now drops down through the footer (7.37–7.53). The 17.33 sheet now slides down (17.13–17.30). No object crosses text. |
| 5 | Key content x ≤ 940 | **PARTLY** | Below y 1000, settled ink reaches 934–958 on tips 2, 4 and 6, and 970 on the checklist paper edge. The CTA logo text sits at about 940. The ✓ badge on the tip 1 final render sits at x≈1000, y≈1490, inside the Reels rail (4.0–4.6). |
| 6 | Dead space and dead time | **PARTLY** | Tip 4 now has the 2×2 layout with the PHYSICS + MOTION hub and is good. Tip 6 is full. The CTA now has an arrow draw, a ray pulse and two sheen passes. Drift-only stills remain at 28.77 (0.67 s), 27.37 (0.53 s), 18.17 (0.48 s), 1.55 (0.47 s, the cover, unchanged) and 11.67 (0.43 s). The bottom 40% of the CTA is still mostly bare. |
| 7 | Audio pass | **PARTLY** | The level now reaches −14.2 LUFS, with a true peak of −1.4 dBTP. The checklist ticks are in-key plucks in the music bed at 23.30 + 0.25k. A chord and a hit at 25.5–25.6 match the stamp landing at 25.5. Music energy above 2 kHz rose from 0.4% to 3.1%. LRA is still 2.4 LU. |
| 8 | Contrast | **PARTLY** | DIALOGUE and AMBIENCE are now ink on cream, at 12–15:1. The checklist numbers are 4.1:1, up from 3.1 but still under 4.5. |

Other named v1 defects:
- The "480p" clipped by the band is **STILL PRESENT** at 2.67, where the band slices the second headline line.
- The split headline cut at the frame edge is **STILL PRESENT** by design at 5.0, 7.5, 10.0, 12.5, 15.0, 17.5, 20.0, 22.5 and 26.5. It is readable within 0.2 s.
- The cover visual sits in the left 55% and the fan never spreads. **STILL PRESENT.**
- The cover SEEDANCE box reaches x=1015. This is above y 1000, so it is OK.

## 2. New defects

- **Dimmed checklist rows** (25.75–26.3): the orange numbers drop to 2.3:1 while the rows dim for the THEN GENERATE. accent. This is a regression.
- **Effects briefly louder than the music** at 2.45 (+3.0 dB) and 22.50–22.55 (+2.2 and +1.0 dB), measured in 50 ms windows. In both places the music dips under the whoosh. This breaks the client's rule.
- **Cramped roll frame** at 17.47: three partial lines ("STRUCTURE IT / GENERATE / ONE FIRST") show inside one box.
- **22.45–22.55**: a blank checklist sheet rises under an empty headline area. It reads as a dead frame before the rows type in.
- **The THEN GENERATE. slam is clipped at both frame edges** from 25.27 to 25.43. As a slam this is acceptable, but it is the only impact frame and it settles small.
- I saw no glitch frames, torn frames or wrong-scene flashes in any dense window.

## 3. Measured

| Metric | v1 | v2 | Verdict |
|---|---|---|---|
| Frozen, strict (YAVG < 0.2, runs ≥ 0.1 s) | 2.62 s, longest 0.45 s | **1.23 s, longest 0.20 s** | Close to the ~1 s limit; pass on longest |
| Frozen, drift-only (YAVG < 0.5) | 9.78 s, longest **2.90 s** (27.1) | 8.85 s, longest **0.67 s** (28.77), then 0.53 s (27.37) | Two stretches over 0.5 s, both in the CTA |
| Integrated loudness | −15.4 LUFS | **−14.2 LUFS** | Pass |
| True peak | −4.5 dBTP | **−1.4 dBTP** | Pass, no clipping |
| LRA | 2.4 LU | 2.4 LU | Flat |
| SFX residual compared with music (RMS) | −36 vs −17 dB | −32.4 vs −16.6 dB | Audible; whooshes run 1–8 dB under the music |
| SFX louder than the music | none | 2.45, 22.50 | **Fail (brief)** |
| Music above 2 kHz | 0.4% | 3.1% | Better |
| Worst text contrast | 2.84:1 (DIALOGUE) | 2.3:1 (dimmed numbers, 25.8); 4.1:1 settled numbers | Fail |
| Headline cap height | 93 px | 121 px | Better |
| Lowest key content | y 1559 | y 1560–1586 (photo and paper edges only) | OK |

The film is understandable on mute: every idea is carried by on-screen type. Frame 0 shows the finished cover.

## 4. Verdict: ONE MORE PASS

v2 is clearly better than v1. The empty boxes are gone, nothing flies through text, the level is right, the tags pass contrast and tips 3, 4 and 6 are strong. It still fails three client rules, each narrowly, and it still reads as one template.

1. **Fix the audio at 2.45 and 22.5.** Duck the whoosh 4 dB, or stop the music dipping under it, so the effect stays under the music.
2. **Contrast.** Make the checklist numbers #B5461A or ink (≥4.5:1), and do not fade them during the 25.75–26.3 dim.
3. **Kill the CTA stills at 27.37 and 28.77**, for example with a slow 3% push across 27.3–30. Also cover the 1.55 cover still with the fan spread.
4. **Give two more scenes their own scale.** Make the THEN GENERATE. punch-in hold at ≥200 px caps, and push tip 2's title to tip-1 scale. Fill the lower half of the CTA.
5. **Move the tip 1 ✓ badge to x ≤ 900**, and close the gaps where the lone box sits on bare paper (12.40, 17.40, 22.45, 26.47) by bringing the next visual in 0.1 s earlier.
