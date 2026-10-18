# UperTib Mobile Design-System Rules

## Direction

The Patient app is Arabic-first while the native React Native root remains LTR to avoid double mirroring. Arabic direction is owned by `AppDirectionProvider` and shared components, not by the device locale or global native RTL state.

Use the shared direction helpers for horizontal layout and logical start/end placement. Do not hard-code physical left/right placement to simulate RTL.

Use LTR only for content whose meaning is intrinsically LTR:

- phone numbers and dial codes,
- OTP codes,
- service or machine identifiers,
- Latin-only brand strings.

## Theme

The app supports light and dark themes. Both are emitted from one semantic token contract.

The Patient app adopts the October 2026 UberTeb identity board. The logo and primary action fill use the **same exact `#00E0B8`** in light and dark; neither dark mode nor pressed/selected states remap primary. Neutrals `#111111`, `#2A2A2A` and white govern surfaces and content. See `docs/BRAND_THEME_2026.md`.

No screen owns raw theme colors. Components consume semantic roles only.

## Type

- IBM Plex Sans Arabic.
- Arabic letter spacing is always zero.
- Patient body text is never visually reduced to create hierarchy; weight and semantic role carry hierarchy.
- Western digits are retained for phone, OTP, dates, amounts and identifiers.

## Geometry

- Interactive control height: 48px.
- Comfortable touch target: at least 44px.
- Control radius: 8px.
- Reading-surface radius: 12px.
- Spacing follows the 4/8/16/24/32/48 scale.
- Resting cards use borders and spacing, not decorative shadows.

## Small top app bar

Use the shared `AppHeader` for secondary and detail screens. The pattern follows common iOS navigation-bar and Material 3 small-top-app-bar conventions:

- compact 52px bar inside the safe area,
- navigation control at the Arabic start edge (right),
- one short contextual title in the center when useful,
- one high-frequency contextual action at the trailing edge when the screen truly needs it,
- 44x44 icon-button touch targets,
- no visible `رجوع` text inside the back control; keep the wording as the accessibility label,
- keep the page H1 in content rather than turning the header into a second large title.

Theme selection lives in Profile → Settings instead of occupying every toolbar. Additional actions should stay out of the top bar unless they are essential to the current screen.

## Icons

Use `expo-symbols` as the governed icon layer across the Patient app:

- SF Symbols on iOS,
- Material Symbols on Android and web,
- one semantic icon meaning per action across platforms,
- no text glyphs such as `‹`, `⌕` or `★` when a platform symbol exists,
- icon-only controls must have an accessibility label on the interactive parent,
- decorative icons are hidden from the accessibility tree.

## Reusable content patterns

- Use `SummaryRow` for key-value information such as price, branch, account ID, appointment and review details.
- Use `StatusTag` for compact readable states. Color is supplementary; the label always carries the meaning.
- Use cards only when the whole unit is independently actionable or needs strong grouping.
- Prefer plain bordered sections and summary rows for static information.

## Buttons

Primary filled buttons and active primary controls use the identity's exact solid `#00E0B8` with white labels/icons, as requested; destructive buttons retain white labels on red. White on `#00E0B8` has insufficient normal-text contrast (about 1.7:1), so this combination cannot be marked WCAG AA without a separately approved text/background treatment. Disabled states use semantic disabled surface/text. No gradients or glow on action surfaces.

## Phone input

Phone entry is one compound custom control:

1. a country/dial-code selector,
2. a national-number input,
3. an Arabic label and validation message.

The shell remains Arabic while dial code and digits render LTR. The country chooser is a custom modal sheet built from the same semantic tokens as the rest of the app.

## Imagery and motion

- Images must support the current patient task or care context; do not add unrelated decorative photography just to fill space.
- Service and treatment imagery used by the mock is illustrative. It must never be presented as patient-specific evidence, a diagnosis, a clinical record or a guaranteed treatment result.
- Provider photos are a separate identity surface from service/treatment imagery.
- Meaningful images require an accessibility label that describes their purpose rather than making a clinical inference.
- Keep motion purposeful and short. Use the shared motion durations, keep the total interaction within the existing 320ms ceiling, and respect the system Reduce Motion preference.
- Animation must never be the only way a state, deadline or outcome is communicated.
- The mock may use centralized remote image URLs. Production assets must move to the governed media source rather than being copied as screen-local URLs.

## Accessibility and health-content guardrails

- Keep touch targets at least 44px; standard controls remain 48px.
- Do not communicate status by color alone. Pair tone with visible text and an accessible label.
- Keep persistent field labels and place validation next to the affected field.
- Patient-facing copy must be task-oriented, short and concrete. Do not expose API, backend, mock, record-authority or implementation explanations in normal product screens.
- Keep cards short and actionable. Prefer plain sections, lists and key-value rows when the content is not independently selectable.
- Test large text, reduced motion, Light/Dark and Arabic RTL before calling a screen complete.
- Accessibility target for the product is WCAG 2.2 AA where applicable to mobile UI.

Reference baseline: Apple Human Interface Guidelines, Android mobile design guidance, NHS digital service manual and WCAG 2.2.

## Mock-first development

The current Patient build has no live network dependency. Authentication and catalog data come from feature-local mock modules. This lets design, navigation and state handling be validated without implying that backend contracts are already live.
