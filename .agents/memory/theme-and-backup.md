---
name: Theme defaults and retained backup
description: The agreed site theme behavior and pre-restyle backup retention condition.
---

Use the original navy/blue theme as the default. The light theme is available only through the user's toggle, is kept in memory only, and resets to blue on refresh. Do not follow the operating system theme or persist the toggle unless the user changes this decision.

**Why:** The project owner explicitly chose the original blue look as the default while keeping the newer light look optional.

**How to apply:** Keep the initial document theme and the toggle's accessible labels consistent with blue-by-default behavior.

Keep `src_backup_before_restyle` until the project owner explicitly confirms that it can be removed.

**Why:** The owner asked to retain the backup for review and will give a separate instruction when it is safe to delete.

**How to apply:** Do not remove or repurpose this backup folder during cleanup or future restyling.
