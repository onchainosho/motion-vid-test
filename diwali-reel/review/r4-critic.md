# R4 critic: film-v5.mp4

## R3 items
1. **Pop 1, CORE chime and sparkle 2:** **PARTLY.** These are same-instant, in-band, 50 ms windows against the music-only stem. Pop 1 at 1.90s is now **+1.8 dB** (was +0.6). The CORE chime at 3.20s is **+1.5** (was +0.9), and sparkle 2 at 2.28s is +2.5 (was +2.1). The gain raises of 4, 3 and 2 dB mostly went into masking, because the music's 2.0s downbeat sits in the same band. Burst 1 still lands almost silent.
2. **Smoke discs:** **FIXED.** From 2.2 to 2.55s the disc centre is 50–64, 32–43, 74–78, against a target under 60,35,80 (v4 was 81–102, 58–76, 86–93). It reads as dark sky with fading sparks, and the gold flood takes over at 2.60s.
3. **Empty beat:** **FIXED.** The logos are gone by 5.30s and "This" lands at 5.45s, with the diya lit by 5.50s. That leaves a 0.15s gap that holds a falling spark.
4. **Footer gap:** **FIXED.** The logos sit at y≈1590–1645 and the diya row starts at about 1745, so the gap is about 100px and balanced.
5. **End card static for 3.1s (needs-a-human in r3):** **FIXED** by the title shimmer. No stretch holds still after 5.03s.

## New defects and regressions
- **N1 (regression, collision):** from **5.12 to 5.30s** the unlit diya bowl fades in at about 70–100% directly over the ADAM logo while ADAM is still near full opacity. The bowl overlaps the tops of "A D" and sits between the mark and the wordmark (5.15, 5.20 and 5.25s). That covers a client logo mid-transition. v4 did not do this at 5.20s.
- The 2–8 kHz spike peaks at +7.1 dB at 2.16s, the same as v4. It stays under the 10 dB jarring line.
- No other collisions, no clipping, and all copy is verbatim.

## Measured
| Check | Result | Pass |
|---|---|---|
| Loudness | −16.9 LUFS (music only −17.0); true peak −2.2 dBFS; LRA 1.9 LU | yes |
| Effects vs music (same instant, in band) | whoosh +4.6; **pop1 +1.8**; sparkle1 +5.2; pop2 +3.4; sparkle2 +2.5; **chime CORE +1.5**; chime ADAM +2.4; whoosh2 +6.2; tap +3.9; tap2 +3.7 | 2 low |
| Holds (diff <0.2) | 0.35s at 1.43s; 0.22s at 3.88s; 0.43s at 4.60s | yes |
| Smoke disc 2.2–2.55s | ≤64,43,78 | yes |
| Empty beat | 0.15s | yes |
| Contrast | "brightest" 5.1, "&" 5.2, "From" 8.2 | yes |
| Logo colour | Softlabs 223,32,45 (src 228,29,37); navy 20,29,88; CORE 3,18,109 (src 1,17,108); ADAM cyan 1,180,249 | yes |
| Clipping | "Happy Diwali" ink x 76–1007 | yes |
| Collision | **diya over ADAM 5.12–5.30s** | **no** |

## Needs a human
- Is "Softlabs Group & Ainfinite AI" acceptable as two logos joined by "&"?
- On a phone speaker, is burst 1 felt? I think it is effectively silent.
- Does the score feel Indian and festive, or generic?

## Verdict: ONE MORE PASS
The picture is now premium. The burst, the gold flood, the logos and the end card all land. One visible logo collision remains, plus two quiet cues.

1. **Diya over ADAM:** keep the bowl at opacity 0 until ADAM has faded below about 20% (around 5.28s), or start it below ADAM's area and rise it in.
2. **Pop 1 at 1.90s and the CORE chime at 3.20s:** more gain will not work against the downbeat. Duck the music about 3–4 dB in the effect's band for 120 ms under each, or move pop 1 to about 1.86s, off the beat. Target +4 dB and keep 2–8 kHz under +10.
