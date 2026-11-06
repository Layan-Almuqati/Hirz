---
name: Reveal thresholds at large text sizes
description: Why scroll-triggered reveals need low thresholds when content height grows with text scaling.
---

Reveal animations must not depend on a large intersection ratio for variable-height content. At the largest site text size, a legal information card can be taller than 1,900px and occupy only about 11% of a phone viewport, leaving it fully transparent under a 12% threshold.

**Why:** The card appeared missing even though part of it was already on screen.

**How to apply:** For scroll-reveal blocks with long or user-scaled text, trigger at a small visible ratio and verify at the largest text step; do not assume a fixed viewport fraction.
