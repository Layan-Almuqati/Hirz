---
name: Responsive browser verification
description: Avoid misleading viewport measurements when debugging headless browser checks.
---

DevTools viewport emulation is scoped to the active browser connection. Reapply the intended viewport when reconnecting after a failed check.

**Why:** A follow-up probe after a failed responsive check saw the browser's default viewport instead of the failed phone viewport, making the same Arabic name appear to fit differently.

**How to apply:** Capture viewport dimensions and failure measurements before closing the original connection, or explicitly set the same viewport on a new connection before diagnosing wrapping, overlap, or clipping.
