# ShieldRA cold outbound compliance SOP

**Date:** 2026-04-12
**Status:** draft operating policy
**Scope:** outbound cold email for ShieldRA only
**Purpose:** reduce regulatory risk, avoid brand sloppiness, and create a clean operating baseline before any cold-email sending

## Blunt call

ShieldRA should start with **US-only cold outreach** until country gating, consent handling, and region-specific rules are implemented well enough to trust.

This is an operating policy, not legal advice. If ShieldRA becomes a serious outbound motion, legal review is still worth doing.

## Non-negotiables

Every ShieldRA cold email must include:
- accurate sender identity
- valid reply-to address
- honest subject line
- ShieldRA-specific branding and sender context
- a real physical mailing address
- a clear unsubscribe path
- suppression enforcement before send

No campaign ships without all of the above.

## Geographic policy

### Allowed now
- United States business contacts only

### Blocked for now
- Canada
- EU/EEA
- UK
- any lead with unknown country

### Why
- US has a workable compliance floor for B2B cold email
- Canada is materially stricter under CASL
- EU/UK create a higher consent and privacy-risk surface
- unknown-country sending is lazy and avoidable

## Required system behavior

### 1. Brand-correct outbound identity
ShieldRA outbound must use:
- ShieldRA sender name
- ShieldRA reply-to
- ShieldRA unsubscribe language/page
- ShieldRA postal address
- ShieldRA campaign IDs and logs

Do not send ShieldRA outbound through a DojoGate-branded user experience.

### 2. Suppression enforcement
Before any send, the system must exclude:
- unsubscribed contacts
- manually suppressed contacts
- hard bounces
- spam complaints
- "do not contact again" leads

Rule: once suppressed, a lead is suppressed across all future ShieldRA outbound unless explicitly and intentionally cleared.

### 3. Unsubscribe handling
ShieldRA outbound must provide:
- one-click or low-friction unsubscribe
- a public unsubscribe endpoint or form
- persistent suppression logging
- immediate operational honoring of opt-outs

Do not rely on "we'll clean it up later" manual handling.

### 4. Lead provenance logging
Every outbound-ready lead should store:
- full name
- company
- email address
- country
- source URL
- source type
- collection date
- why this lead is relevant to ShieldRA
- campaign assigned
- suppression status

If we cannot explain where a lead came from and why it was contacted, it is not send-ready.

## Campaign creation checklist

Before launch:
- target list is US-only
- country field exists for every lead
- all suppressed leads removed
- email footer contains address + unsubscribe
- sender identity matches ShieldRA
- subject line is honest
- body copy does not overclaim
- test send verified
- unsubscribe flow verified
- suppression logging verified

## Copy rules

### Allowed tone
- direct
- relevant
- specific
- respectful
- clearly commercial

### Not allowed
- fake reply bait
- misleading subject lines
- pretending there is a relationship where there is not
- fake personalization
- compliance claims ShieldRA cannot support
- pressure tactics that make complaint risk spike

## Operational rules after send

Monitor:
- bounce rate
- reply quality
- unsubscribe rate
- spam complaint rate
- domain reputation signals if available

Pause a campaign if:
- unsubscribe flow breaks
- suppression enforcement looks suspect
- complaint rate spikes
- list provenance is weak or mixed-country

## Minimum implementation checklist

### Phase 1: must have before sending
- US-only send gate
- ShieldRA-branded footer
- ShieldRA unsubscribe endpoint
- ShieldRA suppression table or equivalent source of truth
- pre-send suppression check
- lead country field
- lead source logging

### Phase 2: should have soon after
- bounce ingestion
- complaint ingestion
- campaign-level compliance checklist UI
- manual suppression admin controls
- audit trail for who sent what and when

### Phase 3: needed before international expansion
- region-aware compliance rules
- consent tracking
- country-specific policy engine
- separate send policies for Canada / EU / UK

## Default decision rule

If there is ambiguity, choose the safer option:
- do not send
- mark the lead for review
- fix the system gap first

## Recommendation

Use this as the operating baseline:
- **US-only**
- **ShieldRA-specific sender + footer + unsubscribe**
- **hard suppression enforcement**
- **lead provenance required**
- **no international cold outreach yet**
