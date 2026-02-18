# Specification

## Summary
**Goal:** Make VoiceMate publicly usable without Internet Identity login so reminders and messaging work immediately for everyone.

**Planned changes:**
- Remove/disable all frontend login/logout and first-time profile setup UI flows so the main app UI is accessible on load.
- Update frontend wording to remove Internet Identity–specific references and reflect shared/public mode.
- Update messaging and “Send Reminder as Message” UX to work without requiring recipient Principal IDs and without relying on per-user filtering.
- Adjust backend authorization so anonymous callers can create/read/update/delete reminders and send/read/delete messages without authorization traps.

**User-visible outcome:** Users can open the app in a fresh browser session and immediately use Reminders and Messages in a shared/public mode without any login prompts, profile setup dialogs, or Principal ID requirements.
