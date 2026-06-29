# Regression Checks

## Deleted Words Can Be Re-Added

1. Add `affiliate` from `/app/quick-add`.
2. Open `/app`.
3. Delete `affiliate` with the trash button.
4. Add `affiliate` again from `/app/quick-add`.
5. Expected result: the pending item changes to `Saved`, not `Already exists`.

This verifies that dashboard deletes remove the active row from `vocab_items`, so the duplicate check no longer sees deleted words.
