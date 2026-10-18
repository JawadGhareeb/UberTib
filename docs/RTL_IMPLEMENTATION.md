# UperTib Mobile — Arabic and RTL Implementation Rules

The Patient app is Arabic-first and RTL-first. These rules implement `NFR.09` while keeping layout direction deterministic on both RTL and LTR devices.

## Direction model

UperTib follows the same direction strategy used by Scent World: native React Native/Yoga direction stays LTR, while the application owns Arabic direction explicitly.

- `I18nManager.allowRTL(false)`, `forceRTL(false)`, and left/right swapping stay disabled at the native root.
- The root view stays `direction: 'ltr'`.
- Do not add a global `direction: 'rtl'` to the root, theme provider, router content, or `Screen`.
- Arabic text is rendered explicitly with `textAlign: 'right'` and `writingDirection: 'rtl'` through `AppText`.
- Horizontal Arabic reading order uses `rowClassName` from `AppDirectionProvider`, which resolves to `flex-row-reverse`.
- The Arabic start edge is exposed by the provider as `startClassName`, which resolves to the physical right edge while the native root remains LTR.
- Do not derive Patient app direction from the device locale. Arabic is currently the only application locale.

This avoids double mirroring when the OS, Expo runtime, or a previous native RTL preference has already changed React Native layout direction.

## Component rules

Use `useAppDirection()` when a component has directional layout semantics:

- `rowClassName` for normal Arabic horizontal reading order.
- `rowReverseClassName` only when the visual order is intentionally opposite.
- `startClassName` and `endClassName` for controls aligned to semantic edges.
- `textAlign` and `writingDirection` are centralized for Arabic text; prefer `AppText` instead of repeating them.

Numeric and Latin-only values remain explicit LTR. Phone numbers, OTP values, identifiers, codes, and similar content should use `direction="ltr"` or explicit LTR input styles.

For mixed Arabic/Latin text, `AppText` automatically wraps plain Latin and numeric runs in Unicode LTR isolates before rendering RTL content. This prevents values such as `UperTib`, `API`, phone fragments, codes, and Western digits from jumping to the wrong visual edge or reordering punctuation. Fully Latin values should still use `direction="ltr"`.

## Navigation

Primary Patient destinations are semantically Home, Discover, My care, Profile. Because the native tab container is LTR, declare/display them so Home remains on the Arabic start edge (right side) without turning the entire native tree RTL.

Back actions align to the Arabic start edge through the shared direction provider. Do not rely on `self-start` by itself because under the native LTR root that means the left side.

## Device language independence

An English, Turkish, Arabic, or any other device language must render the same Arabic application layout. Direction changes must come from application state if another app language is introduced later, not from `I18nManager` or the OS locale.

## Review checklist

For every screen verify Arabic text alignment, horizontal reading order, Back placement, mixed Arabic/Latin content, phone and OTP LTR isolation, tab order, behavior on both LTR and RTL-device OS settings, and that native/global RTL has not been re-enabled.
