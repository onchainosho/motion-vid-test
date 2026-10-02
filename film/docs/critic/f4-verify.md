# F4 verify: v4.mp4 compared with v3

## Polish items
| Item | Status | Evidence |
|---|---|---|
| 2. End-card hold at 28.55 | **PARTLY** | The sun half-disc grows about 6.7% (179 to 191 px tall) across 28.5–29.4, and the POSSIBLE LABS wordmark slides about 12 px left. Both are smooth, but too small to move the metric: the drift-only runs at the end are unchanged from v3. |
| 3. 2–8 kHz ticks | **FIXED (as specified)** | Each tick is exactly 6.0 dB lower: 0.55 (+34 to +28), 3.3 (+19 to +13), 8.3 (+17.5 to +11.6), 13.3 (+11 to +5). They still sit above the music *in that band*, but at about −47 dBFS. |

## Regression hunt
- Pixel difference between v3 and v4 (YMAX) stays at 24 or below on every frame up to 28.05, so frames 0–28.05 match. 26.5–28.05 is unchanged, including the known 2–3 frame overlap with the footer at 26.42–26.50.
- 28.2–30: only the sun and the wordmark differ. There are no glitches or collisions.

## Measured (same method for v3 and v4)
| Metric | v3 | v4 |
|---|---|---|
| Frozen strict, fps 10 at 320 px (YAVG < 0.2) | 0.00 s | 0.00 s |
| Frozen drift-only, fps 10 (< 0.5) | 0.80 s, longest 0.20 s (11.9) | identical |
| Frozen strict, native 60 fps (f3 script) | 1.07 s | 1.23 s (new 0.17 s at 29.83, the final frames) |
| Frozen drift-only, native 60 fps | 8.15 s, longest 1.25 s (28.18) | identical |
| Integrated loudness | −14.2 LUFS | −14.2 LUFS |
| True peak | −1.3 dBTP | −1.2 dBTP |
| LRA | 3.1 LU | 3.1 LU |
| Effects over music, 50 ms broadband | max +0.8 (1.60), +0.3 (10.60) | unchanged |

My native-fps numbers don't reproduce f3's absolute figures, but v3 and v4 are measured the same way.

Frame 0 is still the finished SEEDANCE 2.5 cover, and it is identical to v3. The CTA reads cleanly from about 26.7 to 30.

## Verdict: SHIP
v4 matches v3 everywhere except the last 2 s, and the last 2 s are better. Item 3 is done as specified. Item 2 adds real but tiny motion. If anyone wants the end-hold metric to clear, scale the whole logo and arrow group by 2–3%, not just the sun. That is optional.
