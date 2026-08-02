# Feature 016 Tasks — 123 for the night of 2026-08-01

Execution rule for this batch: research and bulk content are delegated to
subagents; the orchestrator keeps the decisions, the merges, and the build green.
Per the owner's instruction, no new test suites are written in this feature —
validation is lint, typecheck, static build, exported-HTML checks, and browser
passes.

## A. Decide the identity (T1601–T1612)

- [x] T1601 Measure search demand for "driving license" vs "driver license" vs "driving licence" phrasings.
- [x] T1602 Map the head terms to the page that should own each one.
- [x] T1603 Check RDAP for both target domains and every close variant.
- [x] T1604 Check whether any registered variant resolves to a live competitor.
- [x] T1605 Check GitHub/social handle availability for the leading candidates.
- [x] T1606 Run a brand-collision and trademark sanity search.
- [x] T1607 Choose the primary domain and one defensive registration, with reasons.
- [x] T1608 Choose the product name, spoken form, and one-line tagline.
- [x] T1609 Write the positioning statement: what the product closes, and what it never claims.
- [x] T1610 Audit every occurrence of the outgoing brand in the repository.
- [x] T1611 Record the decision and the evidence in `docs/research/`.
- [x] T1612 Write this feature's plan: file ownership, batching, and rollback.

## B. Brand core (T1613–T1634)

- [x] T1613 Rewrite `shared/config/site.ts` around the new name, tagline, and domain.
- [x] T1614 Add the positioning constants: what we show, what only DLT decides, what we never do.
- [x] T1615 Update the root layout metadata: title template, description, applicationName.
- [x] T1616 Add Open Graph and Twitter metadata defaults for every route.
- [x] T1617 Add `WebSite` JSON-LD with the new site name on the home page.
- [x] T1618 Add `Organization`-free publisher wording that avoids implying an official body.
- [x] T1619 Generate a committed favicon from the new mark.
- [x] T1620 Generate `icon.svg` and an apple touch icon.
- [x] T1621 Generate a static Open Graph image and wire it into metadata.
- [x] T1622 Update the header brand lockup in the public chrome.
- [x] T1623 Update the footer brand block and independence notice wording.
- [x] T1624 Update `.env.example` with the new public site name and URL.
- [x] T1625 Update `README.md` title, intro, and route list.
- [x] T1626 Update `docs/PRODUCT_SPEC.md` positioning section.
- [x] T1627 Update `docs/DEPLOYMENT.md` host and domain references.
- [x] T1628 Update `docs/ROADMAP.md` with the rebrand phase.
- [x] T1629 Update `docs/TASK_INDEX.md` active feature and next step.
- [x] T1630 Mark the superseded brand research notes as historical rather than deleting them.
- [x] T1631 Update `CONTRIBUTING.md` and `SECURITY.md` product references.
- [~] T1632 LICENSE — no change: the file is unmodified AGPL-3.0 text whose only name field is the upstream "How to Apply" placeholder. The project's actual attribution line lives in README.md and was updated there.
- [~] T1633 CI/deploy labels — deliberately unchanged: `dlt-smart-queue-api` is the live Cloud Run service name, and renaming it creates a second service at a new URL while the old one keeps billing. The local image tag is kept identical so it cannot drift from deploy-api.yml. Tracked as a separate infra migration.
- [x] T1634 Grep the whole tree and fix any residual brand string.

## C. Re-frame the existing surface (T1635–T1656)

- [x] T1635 Rewrite the home hero around closing the licence question.
- [x] T1636 Rewrite the home sub-headline and primary/secondary actions.
- [x] T1637 Add a licence-journey selector to the home page (new / renew / convert / replace).
- [x] T1638 Re-frame the discovery capability cards as evidence, not as the product.
- [x] T1639 Rewrite `/appointments` copy for the wider promise.
- [x] T1640 Link every journey from `/appointments` into the matching cluster page.
- [x] T1641 Rewrite the `/offices` index intro for the new positioning.
- [x] T1642 Add a "which office can do my journey" note to each city hub.
- [x] T1643 Rewrite the `/guides` index as the evidence-and-procedure library.
- [ ] T1644 Re-title the two existing guides to match the new URL vocabulary.
- [x] T1645 Cross-link the foreigner guide into the journey cluster.
- [x] T1646 Cross-link the availability-evidence guide from every journey page.
- [x] T1647 Update the calendar page intro copy to the new brand voice.
- [x] T1648 Update the compare page intro copy.
- [x] T1649 Update the map page intro copy.
- [x] T1650 Update the history page intro copy.
- [x] T1651 Make the playground clearly internal and keep it out of the public voice.
- [x] T1652 Unify button vocabulary across the surface (one verb per action type).
- [x] T1653 Unify the freshness/source wording used by every view.
- [x] T1654 Unify the empty-state wording across discovery views.
- [x] T1655 Unify the error wording across discovery views.
- [x] T1656 Re-check that no re-framed copy contains a forbidden claim word.

## D. The licence-journey cluster (T1657–T1700)

Each cluster page: typed content, claim kinds, internal links, sitemap entry,
canonical, breadcrumb JSON-LD, and at least one live-evidence call to action.

- [x] T1657 Design the `/licence` cluster information architecture and URL vocabulary.
- [x] T1658 Extend the guide content model with journey metadata (audience, prerequisites, outcome).
- [x] T1659 Add the `/licence` cluster index page.
- [x] T1660 Add `/licence/new-thai-driving-license`.
- [x] T1661 Add `/licence/renew-thai-driving-license`.
- [x] T1662 Add `/licence/convert-foreign-license`.
- [x] T1663 Add `/licence/motorcycle-license`.
- [x] T1664 Add `/licence/international-driving-permit`.
- [x] T1665 Add `/licence/lost-or-damaged-license`.
- [x] T1666 Add `/licence/expired-license`.
- [x] T1667 Add `/licence/five-year-license`.
- [~] T1668 `/licence/public-transport-license` — dropped: the upstream work options are only " NEW THAI" and " RENEW THAI", so the page would be pure third-party procedure with no evidence of our own.
- [x] T1669 Add `/licence/tests-and-exams`.
- [x] T1670 Add `/licence/theory-test`.
- [x] T1671 Add `/licence/practical-test`.
- [x] T1672 Add `/licence/aptitude-test`.
- [x] T1673 Add `/licence/e-learning-course`.
- [x] T1674 Add `/licence/medical-certificate`.
- [x] T1675 Add `/licence/residence-certificate`.
- [x] T1676 Add `/licence/documents-checklist`.
- [x] T1677 Add `/licence/costs-and-fees`.
- [x] T1678 Add `/licence/processing-time`.
- [x] T1679 Add `/licence/driving-in-thailand-rules`.
- [x] T1680 Add `/licence/foreigner-faq`.
- [x] T1681 Add a "start here" decision flow that routes a visitor to the right journey.
- [x] T1682 Add the shared claim-legend component used by every cluster page.
- [x] T1683 Add the shared "what only DLT can confirm" block.
- [x] T1684 Add the shared official hand-off block.
- [x] T1685 Add the shared "check real availability now" block with keyword-aware links.
- [x] T1686 Add prerequisites/next-step chaining between cluster pages.
- [x] T1687 Add per-journey office guidance that uses the committed directory.
- [x] T1688 Add per-journey work-option mapping to the exact upstream keywords.
- [x] T1689 Record which journeys the upstream contract cannot express, and say so on the page.
- [x] T1690 Add source attribution rendering for every reported claim in the cluster.
- [x] T1691 Add a visible "reviewed on" date to every cluster page.
- [x] T1692 Add breadcrumb JSON-LD to every cluster page.
- [x] T1693 Add `ItemList` JSON-LD to the cluster index.
- [x] T1694 Add cluster pages to the sitemap route table.
- [x] T1695 Add the cluster to the public navigation without crowding it.
- [x] T1696 Add cluster links from the city hubs.
- [x] T1697 Add cluster links from the guides index.
- [x] T1698 Add cluster links from the home journey selector.
- [x] T1699 Verify every cluster page is reachable within two clicks from the home page.
- [x] T1700 Verify no cluster page asserts procedure as our own fact.

## E. Evidence integration (T1701–T1712)

- [x] T1701 Add a per-office detail route backed by the committed directory.
- [x] T1702 Show each office's known work options and their upstream keywords.
- [x] T1703 Link each office to calendar, compare, map, and history with its own ID.
- [x] T1704 Add the office detail pages to the sitemap.
- [x] T1705 Link city hubs to their office detail pages.
- [x] T1706 Show geocode precision and its meaning on the office page.
- [x] T1707 Show the capture date and what it does and does not prove.
- [x] T1708 Add an "alternatives nearby" block using the committed coordinates.
- [x] T1709 Keep every office page free of live upstream calls at build time.
- [x] T1710 Re-verify the honest-coverage counts after the additions.
- [x] T1711 Re-verify that blank upstream names still render as blank.
- [x] T1712 Re-verify the comparison cap wording on every hub.

## F. Ship and verify (T1713–T1723)

- [x] T1713 Run Biome and TypeScript across the whole app.
- [x] T1714 Run the production static export and record the route count.
- [x] T1715 Check the exported HTML for old-brand residue.
- [x] T1716 Check canonicals, titles, and OG tags on a sample of every route type.
- [x] T1717 Re-run the contrast and landmark pass on the new pages.
- [x] T1718 Re-run the internal-link audit: no orphans, no dead internal links.
- [x] T1719 Verify the sitemap matches the exported route set exactly.
- [ ] T1720 Browser pass at desktop and mobile widths over the new cluster.
- [ ] T1721 Update the feature docs with the validation evidence.
- [x] T1722 Commit the rebrand in reviewable slices.
- [ ] T1723 Push the branch and write the morning summary.

## Validation

Pending implementation.
