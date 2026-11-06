# R5 critic: film-v6.mp4

Picture differs from v5 only at 4.95–5.28s (mean abs diff >1); logos, copy and clipping are unchanged and still pass.

## R4 items
1. **Diya over ADAM (N1): FIXED.** Logos are gone by 5.12s; the bowl first shows at 5.15s in clean space (5.15/5.20/5.25 checked). No overlap.
2. **Pop 1 / CORE chime: FIXED.** Pop 1 is +4.4 dB at 1.90 (was +1.8); CORE chime +4.4 at 3.20 (was +1.5).
3. 2–8 kHz: max +6.2 dB at 3.20, under the 10 dB line. **Holds.**

## New defects and regressions
- **R1 (regression, audio): burst 2 is now masked.** The score's bell shimmer moved from 1.90/2.15 to 2.02/2.27 and now sits on burst 2. Pop 2 drops to **+1.8** (was +3.4); sparkle 2 to **+2.0** (was +3.7); sparkle 1 to +3.1 (was +5.8).
- **R2 (minor): empty beat grew.** Text and logos clear by 5.12s and "This" fades in at 5.45s, a 0.33s beat (was 0.15). A falling spark that lights the bowl carries it. Not a blocker.
- No collisions, no clipping, copy verbatim, no frozen stretch beyond 0.35s at 1.45s.

## Measured
| Check | Result | Pass |
|---|---|---|
| Loudness | −16.9 LUFS (music −17.0), TP −3.4 dBFS, LRA 2.0 | yes |
| FX lift (same instant, in band) | whoosh +4.6; pop1 +4.4; sparkle1 +3.1; **pop2 +1.8**; **sparkle2 +2.0**; CORE +4.4; ADAM +3.2; whoosh2 +5.8; tap +4.0; tap2 +3.8 | 2 low |
| 2–8 kHz spike | +6.2 dB max | yes |
| Holds (<0.2 diff) | 0.35s at 1.45 | yes |
| Diya vs ADAM | no overlap from 5.12s | yes |
| Empty beat | 0.33s (spark-carried) | marginal |
| Logo colour | CORE 0,15,103 (src 1,17,108); ADAM 0,179,250; Softlabs 227,29,38 (src 228,29,37); Ainfinite 12,23,80 | yes |

## Needs a human
- Is "Softlabs Group & Ainfinite AI" acceptable as two logos joined by "&"?
- On a phone speaker, does burst 2 now feel soft compared with burst 1?
- Does the score feel Indian and festive, or generic?

## Verdict: ONE MORE PASS
The picture is ship-quality. The remaining fault comes from the music fix itself, and it lands on the visual climax.

1. **Get the score bell off burst 2.** Move the second shimmer chord from 2.27 to about 2.40s, or start it after the 2.15 pop decays, or duck the music 3–4 dB at 600–4700 Hz for 120 ms at 2.15. Target pop2 and sparkle2 at +4 dB or more, and keep 2–8 kHz under +10.
2. (Optional) Pull "This" in to about 5.30s to trim the 0.33s beat.
