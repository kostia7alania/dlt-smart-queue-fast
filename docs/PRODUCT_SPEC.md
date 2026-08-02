# Product Spec

The product helps a foreigner in Thailand close the Thai driving licence
question — which licence applies, which DLT office, and when — by making DLT
Smart Queue offices, available driver-license work types, and appointment slot
availability discoverable without manually clicking through the official
multi-step UI.

## Problem

The official DLT Smart Queue flow is linear, UI-heavy, and hard to compare across
offices. Some useful API endpoints are observable without UI authentication, but the
data is fragmented across several steps.

## MVP Goal

Provide a local web app that can:

- list DLT offices
- inspect available New/Renew work options per office
- retrieve vehicle types
- derive work type IDs needed for calendars
- display holidays and slot availability for selected work types
- inspect recent stored slot observations without triggering new slot fetches
- understand the product's independence, privacy, freshness, and booking boundary
- continue from a public appointment page or bounded foreigner guide into the
  right discovery tool and then the official DLT service
- browse the five Bangkok area offices by exact site ID, source name, and
  labelled approximate map anchor before opening a source-aware discovery tool
- expose the normalized data through a Go JSON API and a minimal Next.js playground

## Non-Goals for MVP

- no user authentication
- no booking automation
- no paid notifications
- no Redis, queues, or background monitoring
- no attempt to correct misspelled upstream strings

## Source Notes

Detailed observed upstream flow, request/response examples, edge cases, and preserved
contract strings live in `docs/idea.md`.
