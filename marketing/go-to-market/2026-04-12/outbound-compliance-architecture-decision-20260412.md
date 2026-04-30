# Outbound compliance architecture decision

**Date:** 2026-04-12
**Decision type:** product / platform architecture
**Question:** should ShieldRA reuse DojoGate outbound compliance infrastructure, or should the products be fully separate?

## Decision

**Use shared compliance plumbing, but keep brand-specific outbound behavior separate.**

That means:
- shared suppression / unsubscribe / audit primitives are acceptable
- shared policy-engine logic is acceptable
- shared data model patterns are acceptable
- shared brand identity is **not** acceptable
- shared sender identity is **not** acceptable
- shared unsubscribe experience is **not** acceptable unless it is brand-correct for the recipient

## Why this is the right call

### Option A: fully separate stacks
**Pros**
- cleanest brand separation
- lower risk of cross-product confusion
- easier mental model for each product

**Cons**
- duplicate engineering work
- duplicate compliance logic
- duplicate suppression/audit features
- higher maintenance for the same core problem

### Option B: one shared core plus product-specific surfaces
**Pros**
- one place to get suppression logic right
- one place to get unsubscribe/audit primitives right
- less duplicate work
- lower long-term maintenance
- keeps the risky logic centralized while preserving product correctness

**Cons**
- requires discipline around branding boundaries
- bad abstractions could leak one product into another
- needs explicit tenant/product separation in data and UI

### Option C: one shared outbound system with mixed brand UX
**Verdict:** no

This is the failure mode.
If a ShieldRA recipient sees DojoGate identity, or vice versa, we look sloppy at best and deceptive at worst.

## Required separation boundaries

If we share the core, these must stay product-specific:
- sender name
- sending domain / mailbox
- reply-to
- unsubscribe page copy and branding
- footer copy
- postal address shown to recipient
- campaign objects
- lead ownership / product association
- audit view for user-facing brand context

## Required shared primitives

Safe to share:
- suppression table pattern
- unsubscribe token generation/validation pattern
- opt-out event logging
- bounce / complaint ingestion pattern
- campaign compliance checklist engine
- region gating rules engine
- audit/event model

## Hard guardrails

A shared core is only acceptable if:
- every outbound object is product-scoped
- every lead is product-scoped
- every suppression event is product-aware
- every unsubscribe page resolves with correct product branding
- no sender profile can accidentally send under the wrong product
- test coverage includes wrong-brand leakage cases

## Practical implementation shape

### Core layer
A shared service or module that handles:
- suppression decisions
- unsubscribe token issuance
- unsubscribe event logging
- region policy checks
- compliance checklist evaluation
- audit trail writing

### Product layer
ShieldRA-specific configuration for:
- sender identity
- brand copy
- footer template
- unsubscribe page theme/content
- campaign ownership
- address block
- lead routing

## Recommendation for right now

Build the **ShieldRA outbound policy first** and keep the implementation simple.

Short term:
- implement ShieldRA-specific outbound behavior cleanly
- do not over-engineer a multi-product platform before the first safe sending path works

Medium term:
- extract shared suppression/unsubscribe primitives only after ShieldRA flow is stable
- keep explicit product scoping from day one so extraction is easy later

## Blunt call

**Shared backend logic is fine. Shared customer-facing identity is not.**

If there is ever doubt, split by product.
That is cheaper than explaining to prospects why a ShieldRA unsubscribe page says DojoGate.
