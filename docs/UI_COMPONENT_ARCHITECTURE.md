# UperTip UI component architecture

The same **shared primitives** must be reused across patient routes. The source of truth is `src/shared/theme/tokens.json`; do not hardcode old dark-green colors in feature screens.

## Component ownership

- `src/shared/components/ui/button.tsx` — **all normal call-to-action buttons** (submit, search/results, navigate, confirm). Variants: `primary` (solid approved Primary and **white label/icon**), `outline` / legacy `secondary` (white surface, Primary outline and text), `soft` (light Primary tint, **no border**, Primary label/icon), and `destructive` (danger action). Sizes: `compact` (36px), `sm` (44px), `md` (52px). Use `endIcon` rather than duplicating a text/icon flex row. Use `disabled` and `loading` for async operations.
- `src/shared/components/ui/search-field.tsx` — reusable inline search field with Primary outline and icon, RTL-compatible input, controlled value, and a separate `containerClassName` for placement. Use `TextField` for the more elaborate floating-label fields, including phones and selects via the shared `FieldSurface`.
- `src/features/discovery/components/service-group-card.tsx` — group-specific information/teeth art and a real shared `Button variant="soft"` for "عرض الخدمات".
- `src/features/discovery/components/service-family-card.tsx` — consistent family result rows, with navigation arrow, metadata, and dental-service icon. The `FamilyCard` re-export from `pen-discovery-ui.tsx` preserves existing imports during migration.
- `src/features/discovery/screens/*` — keep screens focused on navigation, state, filtering, and feature composition, not repeated layouts. For example, service search state lives in the screen and rendering lives in `SearchField` and the feature cards.

## When a Pressable is right

Use `Pressable` for **whole-card links, tabs, selectable chips, switches and other non-button gestures**, with accessibility role/state and a functional handler. Do not use raw `Pressable` to reimplement standard filled/outlined/soft action buttons. Do not nest a `Button` pressable inside another `Pressable`: use a neutral container, independent clickable card body and CTA instead.

## Exact brand behavior

- Primary backgrounds: `colors.action.primary = #00E0B8`.
- Primary button labels and icons: `colors.text.onAction = #FFFFFF`.
- Outline: Primary stroke + Primary text/icon on the normal surface.
- Soft: `colors.action.subtle`, **without any border**, Primary text/icon.
- Card boundaries use a neutral subtle border; danger/warning/success keep their semantic colors.
- No hard-coded legacy teal; all theme modes rely on semantic tokens.

## Ongoing refactor boundary

This architecture is applied to shared primitives and the service/discovery actions. **The entire project has not yet been converted**: other feature routes can still contain legitimate special-purpose Pressables or older custom CTA implementations. Review those before claiming global code uniformity. Run `npm run ui:check` and normal Expo checks after UI changes.

## Booking / care design migration

- `src/features/booking/components/booking-case-card.tsx` holds the reusable compact case-list card with status badge, right-side icon, amount, note, and progress rail. The normal card boundary remains neutral.
- `CareFilterTabs` in `src/features/my-care/components/care-v5-ui.tsx` is reused for the case list and booking-detail timeline. `CareV5TimelineRow` supports per-event icons instead of sharing a generic status circle.
- `src/app/(tabs)/discover.tsx` **must open `MyBookingsScreen`** because the bottom tab is labelled حجوزاتي. The separate `/discover` route still contains the dental services catalog and search.
- The booking screen is shared with a standalone `/booking` route: render the custom `CareV5BottomNav` only on that standalone route; **do not show it inside the Expo Tabs screen**.
- Existing case/booking data is mock/demo data. Do not treat it as authoritative clinical or booking data or claim live backend completeness from its visual design. In particular, verify mock case identifiers and scenario routes before changing underlying domain behavior.
