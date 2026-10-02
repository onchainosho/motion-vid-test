# Critic r0: Storyboard

The concept is strong: a real persistent actor, distinct compositions and honest copy. The problems are reading load, position drift, and one expensive shot.

## Ranked problems, one fix each

1. **The labels bring back the clutter the brief cut.** Each tip has about 1.8 s of real reading time. Tip 6 has 18 words, tip 2 has 14, tip 1 has 13, tip 8 has 12, and the cover has 18 in 2.0 s. **Fix:** allow at most 2 small labels per tip, and show 3 cards in tip 6. Cut "KEEP WHAT WORKS" from the cover.

2. **The headline and box move every tip** (top-left, then on a band, then giant), so viewers hunt for the answer. **Fix:** for tips 1–8, put the headline at y≈220 and the box under it, both at x=64. Only the box text and width change. The visuals live in the lower 60%.

3. **The tip 3 3D shot is expensive and pays off for 0.5 s.** The toy-to-real wipe lands at 9.5 s and is cut at 10.0 s. The city-car photo is a rear ¾ view on a straight road, which doesn't match an arc. **Fix:** move the wipe to 8.75 s. End the block car in the photo's pose. Drive all 3D from `t` and test seek determinism first. If that fails, use 2.5D layers.

4. **The checklist is too fast and its identity is muddled.** All 8 ticks land in 1 s. The box is supposed to become row 08's number and "CHECK THESE FIRST." at once. **Fix:** tip 8's box becomes "CHECK THESE FIRST.", then the CTA box. Tick one row per half-beat. Timing: checklist 22.5–26.5, CTA 26.5–30.0.

5. **The transitions are mostly exits.** Most are slide, lift, fan or drop. Only the box and the waveform-to-arrows moment carry an object. **Fix:** tip 1's desert polaroid becomes the first photo on tip 2's wall. Tip 7's TEST 01 card shrinks onto tip 8's phone screen. Use one exit direction for the rest.

6. **Key text sits in the Reels UI zones.** This applies to "KEEP WHAT WORKS" (x>940), tip 4's corner polaroids, tip 5's full-width tags, and possibly "THEN GENERATE." **Fix:** clamp everything to x 64–1000 and y 200–1520. Put tip 4's polaroids in a 2×2 grid around the box.

7. **Tip 6 needs invented copy.** The board says "lines write themselves", but FACTS.md has no prompt text. **Fix:** draw grey bars under the title "SEEDANCE PROMPT".

8. **Tips 1 and 7 repeat a composition**: a big polaroid, checks and an orange mark. **Fix:** make tip 7 an overhead contact sheet. One TEST 01 frame sits among empty slots, and the slots fill on "THEN CONTINUE".

9. **Tip 2 crams two phases into 2.5 s.** **Fix:** use 6 photos. The rain is done by 5.6 s and the pack lands by 6.3 s.

10. **The CTA is clear on mute but passive.** Cream on orange is about 3.0:1. **Fix:** add a wordless hand-drawn arrow pointing at the Reels Follow button. Measure the contrast, and if it is below 3.0:1, use ink text.

Claims check: everything except item 7 traces to FACTS.md. There are no prices or numbers.

**REVISE FIRST**
