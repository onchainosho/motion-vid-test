# Brief: "How to save credits on Seedance 2.5" (Reel version of Possible Labs post 66)

- **What it is for:** An educational Instagram Reel from Possible Labs, made from the 11-slide carousel "How to save credits on Seedance 2.5". It gives 8 practical tips for wasting fewer paid generations.
- **Who is watching:** Instagram users aged about 15–40 who make generative-AI video. They scroll fast, often with the sound off, and care about getting good shots without burning credits.
- **What they should do at the end:** Follow Possible Labs ("LIKE THIS EXPLAINER? FOLLOW POSSIBLE LABS.").
- **Length and size:** 30.0 s, 9:16, 1080×1920, 60 fps.
- **Brand (measured from the slides and logo):**
  - Paper `#EFE8DB` (slide background median 239,232,219; the CTA slide is a lighter `#F4EEE7`), with a faint grid
  - Ink `#000000`; the orange is `#EC6327` (slide box median 236,99,39; logo sun 242,107,40); text inside orange boxes is cream `#F7F0E6`
  - Orange boxes have a ~4px black outline and ~14px corner radius
  - Display type is a heavy grotesque, matched with Archivo 900 at ~78% width; sub-copy is Inter Tight 700; handwritten labels are Kalam 700; small letter-spaced labels ("FIELD NOTE 01", "POSSIBLE LABS · FIELD NOTES") are Inter Tight 600
  - Logo: a white L with an orange half-sun and rays, on black (`1.png`, 150×150). It is redrawn as SVG for the video. On paper the L is ink.
- **Facts file:** `docs/FACTS.md`. This is the only source for on-screen words.
- **Assets:** photos cropped from the user's own slides (`assets/photos/`), used inside taped polaroids. Everything else is built in code, including the three.js grey-block scene for tip 3.
- **Style references:** none given, so the kit's motion notes apply, together with the visual language of the carousel itself (paper, tape, polaroids, orange boxes, hand-drawn arrows).
- **Never claim:** credit amounts, prices, percentages, "X% cheaper", or any Seedance feature not in the slides.
- **Instagram safe zone:** all key text stays inside x 64–1000 and y 200–1560. The bottom ~360 px and the right edge are covered by Reels UI. Brand footer lines there are decoration only.

## Decisions made without the client (they said they're away)
1. **30 s, not longer.** There are 8 tips at 2.5 s each, so every tip keeps only its headline and its orange answer. Sub-copy is dropped.
2. **Music.** The library-music hosts (Mixkit, Pixabay) are blocked from this build machine. The music bed is synthesised in code (not AI-generated) at 120 BPM, so every cut lands on a beat. The SFX are HyperFrames' bundled library sounds. A music-only file is delivered. On Instagram the client may prefer to swap in a trending track; cuts every 0.5 s on a beat suit any 120 BPM track.
3. **Contrast.** Cream text on brand orange measures ~3.0:1. That passes WCAG AA for large text (≥24 px bold, and box text is ≥80 px) but not 4.5:1. It is kept because it is the brand's signature pairing. All small text is ink on paper, at 17:1 or better. This is flagged for a human.
