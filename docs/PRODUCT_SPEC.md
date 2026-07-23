# Product Spec

DLT Parser & Visualizer helps a foreigner in Thailand discover DLT Smart Queue
offices, available driver-license work types, and appointment slot availability
without manually clicking through the official multi-step UI.

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
