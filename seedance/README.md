# Possible Labs — "How to save credits on Seedance 2.5" (Reel)

9:16 · 1080×1920 · 60fps · 30.0s. Built from Field Notes post 66 (carousel art in `img/`, cropped from the slides).

**Rules this film follows**
- Three colours only: paper `#F1EADF`, ink `#0E0F0F`, orange `#EB6327` (sampled from the slides).
- Archivo Black headlines (one size per block, width-axis condensed ≥84%), Inter for labels/subs.
- One idea per shot: question → orange answer → the slide's illustration.
- Orange box is the persistent actor: it floods the frame and lands as the next box (hook→tip 1, tip 8→checklist, CTA→logo).
- Tips turn upward like a feed; progress bar fills across each tip.
- Cuts sit on a 120 BPM grid (every 0.5s): any 120 or 60 BPM track lines up.

**Timeline**: hook 0–2.5 · tips 2.5 / 5.5 / 8 / 10.5 / 13 / 15.5 / 18 / 20.5 · checklist 23 · CTA 26 · logo 28.5–30.

**Rebuild**
```
node seedance/measure.mjs          # after any copy change (fits lines, records box rects)
npx hyperframes render seedance -f 60 -q high -o renders/out.mp4
```
SFX: Pixabay-licensed HyperFrames bundle (whooshes on transitions, soft clicks on checklist ticks), peak −10.6 dBFS so in-app music sits on top.
