# R6 critic: film-v7.mp4

The picture differs from v6 only at 5.38–5.90s, where the line now enters earlier. Everything else is pixel-identical; audio changed at 1.85–2.45s.

## R5 items
1. **Score bell on burst 2: PARTLY.** The music is cut 6–14 dB broadband at 2.03–2.42. Pop 2 now lifts **+4.1** (was +1.8). Sparkle 2 is only **+2.3** (was +2.0). Burst effects were also lowered: film 100 ms RMS falls to **−24 dBFS at 2.1–2.4** (v6 −17 to −19) against a −21 bed, a 0.4s hole at the white bloom.
2. **Empty beat: FIXED.** "This" starts at 5.33 (was 5.45); the gap is about 0.2s, spark-carried.

## New defects and regressions
- **N1 (regression): pop 1 is masked again.** It lifts **+0.9** at 1.90 (was +4.4). Music is identical there, so the pop was lowered about 3 dB. Sparkle 1 is +1.9 (was +3.1).
- **N2:** the broadband cut at 2.03–2.42 reads as a dropout, not a duck.
- No collisions or clipping; copy verbatim.

## Measured
| Check | Result | Pass |
|---|---|---|
| Loudness | −17.0 LUFS, TP −3.4, LRA 2.0 | yes |
| FX lift (same instant, in band) | whoosh +4.6; **pop1 +0.9**; **sparkle1 +1.9**; pop2 +4.1; **sparkle2 +2.3**; CORE +4.4; ADAM +3.2; whoosh2 +5.8; tap +4.0; tap2 +3.8 | 3 low |
| Burst level, film RMS 2.1–2.4 | −21 to −24 (v6 −17 to −19) | **no** |
| 2–8 kHz spike | +6.1 dB max | yes |
| Holds | 0.35s at 1.45 | yes |
| Empty beat | about 0.2s | yes |
| Logo colour | unchanged from v6 (pixel-identical frames) | yes |

## Needs a human
- On a phone, do the bursts now sound weaker than the quiet bed around them?
- Are two logos joined by "&" acceptable for the sign-off line?
- Does the score feel Indian and festive?

## Verdict: ONE MORE PASS
Picture is ship-quality; the audio fix traded masking for a dropout at the climax.

1. **Undo the broadband music cut at 2.03–2.42.** Move only the bell from 2.27 to about 2.45, or duck 3–4 dB at 600–4700 Hz for 120 ms at 2.15. Keep film RMS at 2.1–2.4 at −19 or higher.
2. **Restore burst effect gains to v6 levels.** Target both pops at +4 or more and sparkles at +3 or more, with 2–8 kHz under +10.
