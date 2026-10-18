# UperTib Patient App — Experience Plan

## Purpose

This document translates the approved UX chain in `UperTib-Docs` into an implementation order for the React Native patient app. It does not replace product behavior, screen specifications, API contracts, permissions, lifecycle machines, or error semantics.

## Experience direction — Care Thread

The patient experience should feel like one continuous care thread rather than a collection of marketplace cards. The interface keeps the next meaningful step visible, uses calm flat surfaces, strong reading hierarchy, and a recurring vertical progress rail to connect discovery, booking, treatment, and follow-up.

The visual language is Arabic-first, RTL-first, light-only, and intentionally avoids generic medical-app tropes: no gradient surfaces, no glassmorphism, no decorative dashboard density, no pill-shaped status language, and no shadow on every surface.

## Navigation model

The authenticated patient shell has four persistent destinations only:

- Home — attention-first landing surface (`SCR-PLATFORM-001`).
- Discover — service discovery beginning at catalog groups (`SCR-CATALOG-001`).
- My care — cases as the container for plans, timeline, finance, reviews, and claims (`SCR-CLINICAL-001`).
- Profile — identity, representation, dependents, and pending submissions (`SCR-IDENTITY-004`).

Notifications remain a utility surface and are not a fifth primary destination.

Public discovery remains available before authentication. Any gated action routes through phone verification and returns to the exact originating task after successful authentication.

## Build slices

### Slice 0 — shell and visual DNA

- Brand mark and Arabic typography.
- Semantic token use only.
- App entry.
- Auth form shell.
- Four-destination patient tab shell.
- Reusable progress rail as the first Care Thread primitive.
- Loading, empty, error, stale, and offline patterns remain explicit.

### Slice 1 — first approved patient journey

Implement in this order, matching the Phase 5 patient preview gate:

1. Foundation.
2. Identity / verification.
3. Service discovery.
4. Eligibility.
5. Provider selection.
6. Booking.
7. Confirmation / booking detail.

Stop for visual and UX approval before generating the rest of the 47 patient screens.

### Slice 2 — active care

Cases, case summary, treatment plan, plan acceptance, timeline, stage detail, and follow-ups.

### Slice 3 — records and trust

External financial records, reviews, claims, evidence, appeals, deadlines, and durable notification history.

### Slice 4 — representation

Profile, family and representation, grant creation/detail/revocation, active patient context, dependent verification, and pending submissions.

## Visual rules

- One reading column; expanded width creates whitespace, not a desktop-style second pane.
- Primary content is flat and separated by spacing and hairline borders.
- Elevation is reserved for genuinely floating UI.
- Brand aqua is an identity accent; primary actions use the darker semantic teal.
- Status is never color alone: icon/shape + label + governed tone.
- Rounded surfaces are restrained; status chips are not pills.
- Motion explains state change, progress, or hierarchy and is never decorative.
- The user should understand the current state, the controlling reason, and the next action without opening secondary detail.

## Architecture rules

Route files stay thin. Feature screens orchestrate. Feature components own local presentation. API modules own transport contracts. React Query owns server state. Shared UI contains product-agnostic primitives only. No backend business rule is duplicated in the client.

## Approval gate

The first visual approval should judge the language across entry, verification, discovery, provider decision, and the patient shell before the remaining screen set is built.
