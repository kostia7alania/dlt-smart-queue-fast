# Feature 014 Plan

## Product Direction

Use an editorial field-guide aesthetic: warm paper-like surfaces, dark ink,
small operational labels, and restrained green availability accents. The page
should feel like a calm decision instrument for a stressful government task,
not a government clone and not a glossy booking concierge.

The memorable element is an explicit boundary card beside the hero: what the
service can show, what it never collects, and where the official hand-off starts.
No hero image is required; typography, numbered routes, and a subtle map-grid
background keep the static page fast and self-contained.

## Architecture

```text
app routes (metadata + JSON-LD only)
  -> views/home
  -> views/appointments
  -> views/dlt-foreigner-guide
       -> widgets/public-site-chrome
       -> shared/config/site
       -> shared/ui
```

- Keep the three launch pages as static Server Components.
- Put the official destination, independence statement, and product capability
  descriptors in `shared/config/site.ts` so copy and links cannot drift.
- Reuse one small public header/footer widget across the new public content
  surface; existing interactive views remain untouched in this slice.
- Render metadata and JSON-LD in `app` route files. Follow the checked-in Next
  16 guidance: static Server Components are emitted as HTML, and JSON-LD uses a
  native script tag with `<` escaped after `JSON.stringify`.
- Use the existing Button/Card/Badge primitives and `lucide-react`; add no
  dependency and no client-side state.

## Evidence and Claim Policy

- Safe: the product reads public upstream responses, stores observations, shows
  source/freshness, does not book, and does not require DLT credentials.
- Safe: the user completes booking on the official Smart Queue service.
- Variable: walk-in acceptance, required documents, phone/OTP rules, release
  cadence, and office eligibility. Link to DLT rather than asserting them.
- Never use `official`, `guaranteed`, `reserved`, `fast track`, or a claim that
  a displayed slot will still be available.

## Constitution Check

- No auth, payments, notifications, queue, background worker, Redis, or new
  datastore.
- Next.js remains static UI only; no business logic moves out of Go.
- No upstream string or endpoint contract changes.
- No personal data or third-party tracking is introduced.
- The work is independently testable and remains within the launch surface.

## Validation

1. Run focused Node tests for centralized public-product contracts.
2. Run Biome and TypeScript.
3. Build with Node 26, a configured public URL, and the Thai Queue Scout name.
4. Inspect exported home, appointment, guide, sitemap, metadata, JSON-LD, and
   external-link attributes.
5. Run `git diff --check` and a final scope/claim audit.

## Rollback

The feature is static content and configuration only. Revert its local commits
to restore the previous home page and route set; it adds no schema or external
state.
