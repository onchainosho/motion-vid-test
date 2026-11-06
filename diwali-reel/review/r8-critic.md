# R8 critic: film-v9.mp4

The picture is identical to v8 (video MD5 matches; no regressions in the 0.25s contact sheet). The music cut at 2.0–2.4 is now 6–9 dB under v6 (v8: 10–14).

## R7 items
1. **Pop 1 and sparkle 1: PARTLY.** Pop 1 is +3.3 (target +4). Sparkle 1 is +2.0 (target +3).
2. **Music cut / phone RMS: PARTLY.** Above 200 Hz, 2.2–2.4 passes. 1.9–2.1 is still −22 to −23.
- **N1 (pop 1 masked): PARTLY.** **N2 (phone dropout): PARTLY.**

## New defects
- **R1: Sparkle 2 regressed** from +3.4 to **+1.1**, masked by the restored music. Pop 2 fell from +5.9 to +4.4 but still passes.

## Measured (r7 windows, in band)
| Check | v8 | v9 | Pass |
|---|---|---|---|
| Loudness | −17.0 LUFS | −16.9 LUFS, TP −3.2, LRA 2.7 | yes |
| pop1 / sparkle1 | +1.5 / +1.6 | **+3.3 / +2.0** | no |
| pop2 / sparkle2 | +5.9 / +3.4 | +4.4 / **+1.1** | no |
| >200 Hz RMS 1.9–2.1 | −25 / −23 / −24 | −23 / −23 / −22 | no |
| >200 Hz RMS 2.2–2.4 | −21 / −19 / −20 | −19 / −18 / −19 | yes |
| 2–8 kHz spike, 10ms / 50ms | +7.9 / +5.0 | +7.9 / +5.0 | yes |

## Needs a human
- On a phone, do both bursts sound like fireworks?
- Is the swell boomy?
- Does the score feel festive?

## Verdict: ONE MORE PASS
Both bursts are still underplayed.
1. **Raise sparkle 2 by about 2.5 dB, sparkle 1 by about 1.5 dB and pop 1 by about 1 dB**, to at least +3, +3 and +4. Keep 2–8 kHz under +10.
2. **Ease the music cut at 1.9–2.1 by about 2 dB**, so RMS above 200 Hz is at least −21 there.
