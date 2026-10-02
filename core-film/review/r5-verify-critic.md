# R5 verify critic: film-v6.mp4

v6 differs from v5 in only two places: 9.87–10.55 and 13.02–13.42 (per-frame diff against v5). Every other frame is identical. The click spikes are gone, but the fix overshot: most UI sounds can no longer be heard.

**Method.** Audio was decoded from the mp4s at 48 kHz. Cross-correlation gives a lag of 0 samples to the music-only render. I confirmed this on the lossless `_mix-*-v6.wav` pair, subtracting film minus music to isolate the effects. Lifts are film over music at the same instant, using 5, 10, 20, 50 and 150 ms RMS windows. Stills were checked on every 60 fps frame. I made dense 1/60 s crops at both changed windows.

## r4 items
| Item | Status | Evidence |
|---|---|---|
| Clicks 2–8 kHz ≥10 dB (9.60, 14.45, 16.70, 19.45, 19.75) | FIXED, but overcorrected | The highest 2–8 kHz lift is +8.5 dB at 10 ms (15.6, the whoosh and pop) and +7.1 dB at 20 ms. With 10 ms windows: 9.6 +6.5, 14.4 +5.8, 19.4 +5.2. 16.7 no longer appears. With 5 ms windows, 3.6 (+10.1) and 9.6 (+9.9) still touch the line. |
| Clicks, above 8 kHz | FIXED for clicks | Above 8 kHz, clicks now read +2 to +8 dB at 10 ms. The remaining HF over +15 dB comes from whooshes: 15.6 +19, 5.4 +16, 19.4 +17. |
| "Build once." flies through the outgoing ring and chips (10.08–10.20) | FIXED | The chips and ring are gone by 10.10. The headline now emerges from the slab: it is faint on the slab face for one frame (10.183) and clear above it from 10.20. |
| Step cards cover "SHARED INTELLIGENCE FOUNDATION" | FIXED | The label fades out over 13.00–13.17 and is gone before the cards rise at 13.30. |
| "Build once." drifts on exit | PARTLY (minor) | It still rises about 6 px while fading (13.30–13.43). |
| Empty slab 17.70–17.83 | STILL PRESENT (minor) | Unchanged. It reads as a morph. |
| S11 ring / mono labels | PARTLY (acceptable) | Unchanged. |

## New defects and regressions
1. **The UI sounds are now inaudible (regression).** I measured each effect in its own band (median frequency about 1.6 kHz, ±0.7 oct) on the lossless stem against the music at the same instant:
   - 3.50 −2.4 dB, 5.95 −3.5 and 9.50 −6.1. These still lift the film by 1.5–2.3 dB.
   - The rest are buried 8–16 dB under the music: steps at 13.85 −13.5, 14.35 −8.4 and 14.85 −12.6; chips at 19.38 −10.3, 19.58 −10.8 and 19.78 −16.2; **logo lock at 24.10 −10.4**; **CTA press at 25.00 −13.3**. The film lifts ≤0.6 dB at each of these.
   - The shield ping at 16.40 is −46 dB, which means it is effectively absent.

   The audio rules say "never inaudible". The mix log's "in-band lift 0.0 dB" for these events says the same thing.
2. **Whooshes run over the +3–4 dB target.** These are 150 ms in-band body lifts (328–657 Hz): 17.45 **+8.5**, 15.45 **+7.2** and 5.20 **+7.1**; also 6.30 +5.6, 8.15 +5.6 and 13.15 +5.8. They are unchanged since v5, so this is not a regression, but it is now the loudest effect layer. The 15.30 pop and 15.45 whoosh together give the film's largest 2–8 kHz lift (+8.5 at 10 ms).
3. **Minor:** the "Useful output. Human control." card rises in through the bottom frame edge over 13.33–13.37, so its text is clipped for about 3 frames. This also happened in v5.

## Measured
- **Film loudness:** −16.9 LUFS, LRA 3.2 LU, true peak −4.2 dBFS.
- **Music-only loudness:** −17.0 LUFS.
- **Momentary loudness, film over music:** at most +2.4 LU, at 16 s.
- **Strict 60 fps stills:** no hold ≥0.2 s before the end card. Total near-frozen time before the end card is 0.77 s (mean diff below 0.1), and the end card's last 0.27 s settles.
- **Transitions:** the largest diffs are at 5.68–5.77 (the push through the ring) and 15.58–15.63 (the purple expand). Both are continuous moves, with no strobe.
- Frame 0 is finished, and the facts and contrast are unchanged from r4 (pass).

## Verdict: ONE MORE PASS (audio only; the picture is ship-ready)
1. **Bring the UI sounds back to +2–3 dB in their own band (body, 150 ms)** at 13.85, 14.35, 14.85, 16.40, 19.38, 19.58, 19.78, 24.10 and 25.00, and keep the 2–8 kHz lift at or under +4 dB at 10 ms. The low-passed click sample makes this possible: raise the gain by about 10–14 dB from v6's level. The logo lock and the CTA press matter most.
2. **Trim the whooshes at 17.45, 15.45 and 5.20 by about 4 dB, and 6.30, 8.15 and 13.15 by about 2 dB**, so the body lift lands near +3–4 dB. Soften the 15.30/15.45 pair, which sits within about 0.15 s, by ×0.6 as the clustering rule asks.
3. *(Optional, picture)* Start the "Useful output" card fully inside the frame, or mask it, over 13.33–13.37.
