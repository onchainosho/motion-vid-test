# F3 verify: v3.mp4 compared with v2

Evidence is in /tmp/critic-v3/. I re-measured v2 the same way, so its frozen figures differ slightly from f2's.

## 1. f2 items

| Item | Status | Evidence |
|---|---|---|
| Audio: effects louder than music at 2.45 and 22.50 | **FIXED** | Now −4.1 dB at 2.45 and −1.6/−2.5 dB at 22.50/22.55. New marginal windows: 1.60 (+0.8) and 10.60 (+0.3), level with the music. |
| Checklist number contrast | **FIXED** | 5.5:1 settled, and still 5.5:1 at 25.75, 25.9, 26.1 and 26.3. v2 was 2.38:1. |
| CTA stills at 27.37 and 28.77 | **PARTLY** | A slow push (about 1%) and sheens at 28.0 and 29.6 were added. One drift-only still remains: **28.55 (0.87 s)**, the end card. |
| Cover still at 1.55 | **FIXED** | A coin drops at 1.3–1.6. The fan still never spreads. |
| THEN GENERATE. at ≥200 px | **STILL PRESENT** | It settles at 84 px caps (y 1386–1469). (v2: about 70 px). |
| Tip 2 title at tip 1 scale | **STILL PRESENT** | 63 px caps per line, against 124 px on tip 1. |
| Fill the lower CTA | **PARTLY** | The arrow and logo fill y 1000–1460. Below that it is bare. |
| Tip 1 ✓ badge at x ≤ 900 | **FIXED** | Now x 840–918. |
| Lone box on bare paper | **PARTLY** | 2–4 frames at 12.40 and 17.40, about 0.07 s at 26.47. 14.88–15.00 shows the box plus an orange line only. |
| 22.45–22.55 blank sheet | **PARTLY** | The headline is present now, but the sheet is blank from 22.50 to 22.63. |
| Cramped roll at 17.47 | **STILL PRESENT** | "STRUCTURE IT / GENERATE / ONE FIRST" shows for 1–2 frames. |
| "480p" sliced by the band at 2.67 | **STILL PRESENT** | Lasts 2 frames. |
| Template layout | **STILL PRESENT** | Every tip still uses headline top-left, box, then visual. |

## 2. New defects and regressions
- **26.42–26.50:** the exiting checklist overlaps the footer text for 2–3 frames.
- **High-band ticks:** at 0.55, 3.3, 8.3 and 13.3 the effects spike 10–30 dB over the music in the 2–8 kHz band. They stay under the music broadband, as in v2.
- There are no glitch frames, wrong-scene flashes or text collisions in any dense window.

## 3. Measured (same method for both cuts)

| Metric | v2 | v3 |
|---|---|---|
| Frozen, strict (YAVG < 0.2, runs ≥ 0.1 s) | 0.95 s, longest 0.20 s (29.8) | **0.62 s, longest 0.15 s** |
| Frozen, drift-only (< 0.5) | 6.70 s; 0.62 s (28.77), 0.53 s (27.37) | 6.45 s; **0.87 s (28.55, end card)**, then 0.47 s (18.17) |
| Integrated loudness | −14.2 LUFS | −14.2 LUFS |
| True peak | −1.4 dBTP | −1.3 dBTP |
| LRA | 2.4 LU | **3.1 LU** |
| SFX residual vs music, RMS | −32.4 / −16.6 dB | −33.6 / −16.7 dB |
| SFX above music, 50 ms windows | +3.0 (2.45), +2.2 (22.50) | +0.8 (1.60), +0.3 (10.60) |
| Checklist numbers | 4.1:1 settled, 2.38:1 dimmed | **5.5:1 throughout** |
| Tip 1 badge, right edge | x≈1000 | x≈918 |
| THEN GENERATE. caps | ≈70 px | 84 px |

Frame 0 is the finished cover. The film works on mute, and the CTA is readable for 3.3 s.

## 4. Verdict: SHIP

All the client's mandatory rules now pass, or miss only by sub-dB or sub-frame margins:
- contrast is fine;
- the effects sit under the music;
- strict frozen time is 0.62 s;
- the safe zones are clean;
- the level is −14 LUFS with −1.3 dBTP.

The only still stretch over 0.5 s is the 0.87 s end-card hold, which carries a slow push and a sheen.

On premium: this is a clean, on-brand, tightly timed explainer. It reads like a well-animated version of the carousel, not like a launch film. The repeated layout and the small type on tip 2 and on THEN GENERATE. keep it short of elite. These are design-ambition gaps, not defects.

Optional polish, if time allows:
1. Push tip 2's headline to about 120 px caps, and hold THEN GENERATE. at 150 px or more.
2. Add a gentle 2–3% scale on the logo or arrow across 28.4–29.4 to break up the 0.87 s end hold.
3. Duck the 2–8 kHz ticks at 0.55, 3.3 and 8.3 by about 6 dB.
