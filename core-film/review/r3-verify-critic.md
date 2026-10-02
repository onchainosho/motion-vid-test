# R3 verify critic: film-v4.mp4

v4 fixes most of r2's picture list. The line reveals now run left to right, the exits fade in place, the lone ring frames are gone, and the music lifts at the end. But the edit introduced a hard purple strobe at 15.4, the stack callouts collide, and the clicks are unchanged.

## r2 items
| Item | Status | Evidence |
|---|---|---|
| Fragments on exits | PARTLY | 20.52 and 23.52 now fade in place (FIXED). "Build once." still drifts up into the top edge while fading, 13.43–13.55. |
| Headline before chips (1.62) | FIXED | The headline reaches 0 by 1.43, and the chips move at 1.60. |
| Reveals end-first | FIXED | "Put intel…", "Understand th…", "Prove the va…" and "Private int…" all wipe left to right. |
| "AI Agents" collision (8.52) | FIXED | It sits in its own bottom slot from 8.10. |
| Near-blank 15.87–16.10 | PARTLY | The shield and "Grounded" start at 15.88 and the speck is gone. The purple is still empty at 15.75–15.87, and see the regression below. |
| Empty slab (17.72–18.05) | PARTLY | Cut to 17.70–17.83 (0.13s). The headline now overlaps it. |
| Lone ring (20.55–21.0) | FIXED | "Start small." begins typing at 20.63. |
| Lone ring (8.18–8.33) | FIXED | The "AI Agents" chip comes with it. |
| Mono labels about 20px | PARTLY | Now about 28px tall, contrast 12:1. Still tiny on a phone. |
| End card's bottom 30% empty | STILL PRESENT | The content ends at y=1350. Rows 1350–1920 are empty. |
| Scene 11 ring about 40% width | STILL PRESENT | About 39% at 22.5. |
| Ticks, 2–8 kHz | STILL PRESENT | 3.55 +9.3, 9.60 +9.2, 16.70 +9.2, 19.40 +7.8, 14.45 +6.4 dB over the music-only render. That is essentially r2's level, and 3.55 is louder. |
| Ticks, 8–16 kHz | STILL PRESENT | 3.55 +19.8, 16.70 +19.8, 14.45 +14.9, 5.35 +13.0, 20.45 +12.9, 9.55 +12.5, 19.45 +12.3 dB. |
| Music lift 21–24 | FIXED | The music runs about −17 dB against −19/−20 dB in the body. There are hits at 23.50 and 24.00, about +9 dB transients. LRA is 3.2 LU. |
| CTA ripple | Not re-flagged | |

## New defects and regressions
1. **A purple strobe at 15.40–15.48 (severe).** Six frames of solid #5F00A6 cut in, then the picture snaps back to the step list at 15.50 before the card properly expands at 15.50–15.75. Frame diff is 158 and 153, the largest in the film. It lands 0.1s before the 15.50 music hit, so it reads as a render glitch. On a phone feed it is the most visible flaw in the film.
2. **Stack callouts collide (about 11.5–13.4).** The three label cards ("Reusable capabilities / Governed intelligence / Connected knowledge") overlap each other. The tops of "Governed" and "Connected" are clipped by the card above. The cards sit about 32px from the right edge. This fails the "no text collisions" and "equal spacing" rules.
3. **Ring hub glitch (8.5–10.0).** Two connector lines and a node dot pass through the ring's hole, so it reads as an "i" or a crosshair rather than the logo.
4. **Minor: the step cards slide up over "SHARED INTELLIGENCE FOUNDATION" (13.43–13.50).**
5. **Minor: a near-empty frame at 10.18–10.22.** Only a tiny "Build once." is on screen as it scales in.

## Measured
- **Film loudness:** −16.9 LUFS, LRA 3.2 LU.
- **Music-only loudness:** −17.0 LUFS, LRA 3.2 LU.
- **Broadband excess over the music:** at most +5.0 dB, at 15.40.
- **Strict 60fps still check:** no stretch at or over 0.33s. Total frozen time is 0.15s, and the end card has slow drift.
- **Contrast:** the CTA is about 9:1, "Ainfinite AI" 7.7:1 and the mono labels about 12:1.
- **Transitions:** 1.62, 3.40, 5.73, 6.62–6.75, 13.47, 15.40 (glitch), 15.62, 17.67, 23.73.

## Verdict: ONE MORE PASS
The film is close. The 15.40 strobe alone keeps it from sitting next to a premium launch film.

1. **Remove the 15.40–15.48 purple flash.** The "Useful output" card should expand once, continuously, starting 15.50 on the hit, with "Grounded" landing by 15.80. Don't leave the purple empty after 15.75.
2. **Re-lay the stack callouts.** Use three separate rows with equal gaps, at least 24px apart, no overlap, each aligned to its own layer, and at least 64px from the right edge. Stop the connector lines at the ring's outer edge, not through the hole.
3. **Actually attenuate the clicks.** A −8 dB shelf above 8 kHz and −5 dB at 2–8 kHz at 3.55, 5.35, 9.55, 14.45, 16.70, 19.45 and 20.45. The target is ≤ +4 dB in the 2–8 kHz band. Then verify the change against the music-only render, because r2's request did not land.
