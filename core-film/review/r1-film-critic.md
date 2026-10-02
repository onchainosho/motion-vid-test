# R1 film critic: film-v2.mp4

The ring carries the story and the palette is on brand. The film is clean, but not premium. The back half is mostly empty lavender, words get sliced at the frame edge in six transitions, and text runs through text four times.

## 1. Scenes (empty % = share of frame with no subject; "Lose" = seconds it could lose)
| # | Time | Content | Empty | Lose | Problems |
|---|---|---|---|---|---|
| 1 | 0–1.7 | Card wall plus headline card | 5% | 0 | Card is translucent (#EBE9F1), so wall labels show through behind the headline. The line ends on a comma. |
| 2 | 1.7–3.3 | Collapse into ring, "through one intelligent foundation." | 45% | 0.3 | The verbatim line is cut short. |
| 3 | 3.3–5.5 | Wordmark plus tagline | 70% | 0.6 | 3.40 is 91% empty with fragments "ence/Lay/se". "E" clipped at 3.6. Still for 0.78s from 4.25. |
| 4 | 5.6–6.6 | Portal, then "Your business" list | 40% | 0 | Strong beat. |
| 5 | 6.6–8.5 | Foundation card, Semantic Search ticked | 40% | 0.3 | Card floats on empty lavender. |
| 6 | 8.5–10.2 | Output hub, AI Agents ticked | 45% | 0.2 | Outputs fly through the list text (8.55–8.75). |
| 7 | 10.2–13.4 | "Build once." plus 3D stack | 45% | 0.8 | Title sits on the ring and the output row (10.20). Stack is about 50% width with 22px labels. Barely moves from 11.6 to 13.0. |
| 8 | 13.4–15.6 | Steps 01/04/06, then "Useful output" | 50% | 0.2 | Small floating cards, clipped at the frame edge (14.0, 14.4). Two headlines overlap (13.45–13.6). |
| 9 | 15.6–17.8 | Purple flood, "Grounded in what your organisation approves." | 75% | 0.7 | Words sliced to "at/yo" (15.8–16.3) and a stray dot at 16.0. Still for 0.95s. |
| 10 | 17.8–20.8 | "Private intelligence…" plus diagram | 55% | 0.5 | "inside the environ" clipped (18.0). Bottom 40% empty. Ring crosses the "Access policies" chip (20.85). |
| 11 | 20.8–23.8 | "Start small / Prove the value / Scale from there" | 70% | 0.8 | The ring is a 60px dot, so there is no lead subject. Ring flies through "from there." (23.75). |
| 12 | 23.8–27 | Wordmark, CTA button (83% width), Ainfinite AI | 65% | 0 | CTA is readable for 2.8s. Bottom third is empty. |

## 2. Defects
- **Words sliced at the edge:** 3.38–3.75, 13.45–13.70, 15.80–16.35, 17.95–18.30, 20.65–21.15, 23.55–23.95.
- **Collisions:** 8.55–8.75, 10.20–10.30, 13.45–13.60, 20.80–20.90, 23.70–23.78.
- **Busy backing:** 0–1.6, wall text visible inside the headline card.
- **Near-blank frames:** 3.40 and 16.0.
- **Colour:** purple #6000A7 matches; background #EDEDF6–#F1F2F9 against #F7F8FB is acceptable.
- **Contrast:** settled text passes (mono labels 11.7:1, Ainfinite AI 7.7:1). Mono labels are only about 21px tall, which is tiny on a phone.

## 3. Changes by impact
1. **No sliced words.** Mask each line with `overflow:hidden` and reveal it with `yPercent 110→0` or a `clip-path` inset. Limit opposite-side `x` offsets to ±120px. The outgoing headline reaches `autoAlpha:0` before the incoming one starts.
2. **Fill the back half.** Scene 10 diagram at 92% width, centred at y≈56%, ring 2×. Scene 11: the ring grows behind the type on a white panel (≥0.9 alpha) and becomes the O of the wordmark. Scene 12: wordmark at 85% width, stack centred, and the ring or wall fills the bottom.
3. **Fade, then fly.** The list reaches 0 opacity by 8.50. "Build once." enters only after the outputs are below 0.1 opacity. The chips fade before the ring drops at 20.8. The ring at 23.7 passes behind or around the text.
4. **Opening card.** Use #FFF at 0.96 with `backdrop-filter: blur(24px)`, and use the verbatim line or a visible ellipsis.
5. **Scene 8.** Stack the steps vertically at 82% width inside a 64px safe area, with the camera following the pulse.
6. **Holds and scale.** Make the 3D stack 85% width with labels at 34px or more. Trim scenes 3, 7, 9 and 11 (about 3s in total). Replace the still holds with slow pushes (`scale 1→1.05`, `power2.inOut`).
7. **Audio.** Cut the 2–8 kHz ticks by 5 dB at 3.55 (+9.7), 9.55 (+10.5), 14.40 (+10.0), 16.70 (+12.8) and 19.45 (+12.7). Move the 1.85 whoosh 0.15s earlier, to the collapse peak at 1.65. The music is flat at −16/−17 LUFS short-term from 6s to 26s: add +2 LU at 21–24s and a hit at 24.0.

## 4. Measured
- **Frozen time:** `frozen-time.sh` reports 0.3s, all on the CTA. A stricter 60fps check finds holds of 0.78s (4.25), 0.95s (16.55) and 0.70s (18.45), which break the 0.5s rule.
- **Film loudness:** −16.9 LUFS, LRA 1.7 LU, peak −5.4 dBTP.
- **Music-only loudness:** −17.0 LUFS, LRA 1.6 LU.
- **Effects compared with music:** in-band lift is 0 to +7 dB, but five ticks rise 10 dB or more at 2–8 kHz. The largest broadband excess is +5.2 dB (15.7, where the music drops out).
- **Transitions (frame difference):** 1.65, 3.40, 5.72, 6.7, 8.6, 10.2, 13.45, 15.75, 17.9, 20.8, 23.8.

**ONE MORE PASS.**
