# R2 verify critic: film-v3.mp4

v3 is cleaner than v2. The opening card is now solid, the ring becomes the O of the wordmark, and the diagram and steps fill the width. It still isn't premium, for three reasons: line reveals and exits show fragments of words, frames go empty at three transitions, and the clicks are still bright.

## Previous defects
| Item | Status | Evidence |
|---|---|---|
| Words sliced at the edge | PARTLY | Entrances now use in-place wipes. Exits still slide off the frame: "inside the environment" leaves the left edge at 20.52–20.62, "Prove the value" leaves left while "Scale from there" leaves right at 23.52–23.60, and "Build once." is pushed off the top at 13.50. |
| Collision 8.55–8.75 | PARTLY | The list is gone, but the "AI Agents" card lands on "Enterprise Search" and "Workflow Automation" at 8.52–8.60. |
| Collision 10.20 | FIXED | "Build once." enters only after the outputs have faded. |
| Collision 13.45 | FIXED | |
| Collision 20.80 | FIXED | The chips fade before the ring moves. |
| Collision 23.70 | FIXED | The ring flies in to become the O. |
| Busy backing 0–1.6 | FIXED | The card is opaque white, and frame 0 is finished. |
| Near-blank 3.40 | FIXED | |
| Near-blank 16.0 | STILL PRESENT | The frame is solid purple with nothing on it at 15.87–16.03, then a lone white speck at 16.03–16.10. |
| Mono labels about 21px | STILL PRESENT | "POWERING…", "SHARED INTELLIGENCE FOUNDATION" and "YOUR CONTROLLED ENVIRONMENT" are still about 20px tall. |
| Change 2: fill the back half | PARTLY | The scene 10 diagram is about 92% width (FIXED). Scene 11's ring is about 40% width with no panel. On the end card the wordmark is 84% and the CTA 82%, but the bottom 30% is empty. |
| Change 4: opening card | FIXED | The "…through one intelligent foundation." continuation now reads. |
| Change 5: vertical steps | FIXED | |
| Change 6: holds and scale | PARTLY | No still lasts over 0.5s before the CTA (strict 60fps check). The scene trims were not made: scene 3 still runs 2.2s and the runtime is unchanged. The stack is about 70% width with small labels. |
| Change 7: ticks, 2–8 kHz | PARTLY | Lifts are 3.55 +9.0, 9.55 +8.7, 14.40 +7.7, 16.70 +10.5 and 19.40 +10.5 dB, down only 1–2.5 dB. In the 8–16 kHz band they spike +18 to +27 dB at 3.55, 9.55, 14.45, 16.70 and 19.45. |
| Change 7: whoosh | FIXED | It now peaks at 1.70, matching the collapse at 1.67. |
| Change 7: music lift | STILL PRESENT | Band level is flat at about 71 dB from 21 to 24s. The 24.0 "hit" is only +1.4 dB. LRA is 1.5 LU. |

## New defects
1. **Wall chips run through the headline (1.62–1.78).** The collapse starts while "Connect your company knowledge," is still at 40–70% opacity.
2. **Second lines reveal end-first.** Second lines wipe right to left, so the reader sees word endings first: "tion / undation." (2.12), "ork." (10.73), "sation" (16.17), "ronment" (18.08), and "value / data." alone at 21.48. They look like typos.
3. **Empty transitional frames.** A plain purple slab, then an empty lavender card (17.72–18.05). A lone ring on blank lavender for 0.45s (20.55–21.00). A lone ring for about 0.2s (8.18–8.33).
4. **Minor: CTA tap ripple (24.97–25.30).** It is a faint disc over "your data". It's acceptable, but it slightly softens the CTA.

## Measured
- **Film loudness:** −16.9 LUFS, LRA 1.6 LU, peak −5.2 dBFS.
- **Music-only loudness:** −17.0 LUFS, LRA 1.5 LU.
- **Broadband excess over the music:** at most +6.8 dB, at 15.7.
- **Strict still stretches:** only on the CTA (24.28 for 0.72s, 25.78 for 1.2s). Total frozen time is 1.9s, all on the end card, which is allowed.
- **Contrast:** the CTA is white on #5E00A7, about 9:1. Settled text passes.
- **Transitions:** 1.67, 3.40, 5.73, 6.62, 10.2, 13.47, 15.75, 17.9, 20.5, 23.6.

## Verdict: ONE MORE PASS
1. **Kill the fragments.** Reveal every line with the same direction mask, left to right or bottom to top, so no line wipes right to left. Exits should fade or mask in place, never slide off the frame (13.50, 20.52, 23.52). The headline reaches opacity 0 by 1.60 before the chips move. "AI Agents" lands in its own clear slot (8.52).
2. **Fill the dead frames.** Start the shield and "Grounded" at 15.87, not 16.03, and remove the speck. Put the diagram content on the purple slab as it shrinks (17.72–18.05). Have "Start small." begin as the diagram leaves, so the lone ring never sits alone (20.55–21.0).
3. **Audio.** Shelve the clicks −8 dB above 8 kHz and −4 dB at 2–8 kHz at 3.55, 9.55, 14.45, 16.70 and 19.45. Add +2 LU at 21–24s and a real downbeat at 23.6, where the wordmark lands.
