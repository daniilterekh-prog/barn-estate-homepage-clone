# Five primary nodes are final and immutable

The user explicitly finalized these pages on 2026-11-06 and prohibited further changes:
`gorodskaya-nedvizhimost/`, `kommercheskaya-nedvizhimost/`, `zagorodnaya-nedvizhimost/`, `mezhdunarodnaya-nedvizhimost/`, `kurortnaya/`.

Their approved files and shared dependencies match commit `dd0cba9a0f5d11ead9e9f56451bb40e3a730def7` exactly. `FINAL-NODES.json` records their Git blob hashes. CI rejects changed final files before deployment.

Do not modify, regenerate, resynchronize, restyle or replace these files or their existing shared dependencies. Work on internal pages is not authorization to change the primary nodes. Changed components and controllers for other pages must be isolated outside the protected packages and shared paths. Do not alter the lock or disable its test without a new explicit user instruction revoking this finalization.

Source policy: `barnes-sites/main-site/AGENTS.md` and `FINAL-NODES.md`. This public repository is the deployed export; preserve the source-of-truth workflow.
