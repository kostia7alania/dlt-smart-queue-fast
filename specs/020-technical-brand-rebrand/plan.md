# Feature 020 Plan

## Baseline

- Clean `main` at `6b2ca76`, matching `origin/main` after a verified fast-forward.
- Public UI and metadata already use **Thai Driving License**.
- GitHub repository and Go module still use `dlt-smart-queue-fast`.
- GitHub has no repository Actions variables or secrets for the manual Cloud Run
  workflow and no deployments from `main`. Existing deployment records are
  historical Render pull-request previews, not verified production services.

## Change sequence

1. Record the migration as Feature 020 and make it the active feature.
2. Rename current source/config identifiers and current documentation while
   leaving DLT upstream contracts and historical evidence intact.
3. Run the smallest relevant local frontend, data and diff checks. Go is checked
   locally only if the toolchain is available.
4. Commit and push the source migration to the current repository so GitHub CI
   validates the exact revision before the repository endpoint changes.
5. Rename the GitHub repository to `thai-driving-license`, update `origin`, and
   verify repository metadata, branch SHA, redirect behavior and CI result.

## Rollback

The source migration is one commit on `main`. GitHub keeps redirects after a
repository rename, but rollback of the external name must be an explicit GitHub
rename and matching `origin` update. Do not create or delete cloud services as a
rollback shortcut.

## Constitution check

No product behavior, DLT contract, datastore, auth, queue or dependency changes
are introduced. The work makes the existing implementation and durable project
documentation agree with the already selected product identity.
