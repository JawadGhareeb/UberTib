# Patient form design system

All patient-facing text, date, location, country and phone inputs must use the shared form primitives in `src/shared/components/ui`.

## Visual contract

- Labels **float across the top edge** of the outlined field (right aligned for Arabic), keeping values and placeholders uncluttered. The label shifts subtly on focus.
- One frame component: `FieldSurface`, consumed by `TextField`, `SelectField` and `PhoneNumberField`.
- Selected segmented controls use `SegmentedField` with the same field radius and minimum height.
- Frame height and radius are read from `size.formField` and `radius.formField` in `src/shared/theme/tokens.json`, exposed through NativeWind classes `min-h-form-field` and `rounded-form-field`.
- Surfaces are solid; no gradients or glows. Label: `text-content-secondary`; entered values: `text-content-primary`; hints: `text-content-placeholder`.
- Leading icons occupy a 36×36 subtle-tint square, aligned to the **right** for Arabic RTL, with a compact left chevron for selection fields.
- Focus uses `border-focus-ring`, `bg-state-selected`, a short animated teal underline and subtle icon scale; errors use `border-tone-danger-border` plus text feedback; disabled fields use readonly tokens. All motion respects Reduce Motion, shares durations from the brand tokens, and never flashes or loops unnecessarily.
- All forms use the shared Arabic typography roles, preserving system font scaling and readable line heights.

## Interactive behavior

`TextField` keeps native input focus, autofill, RTL/LTR, keyboard, multiline and validation behavior. Set `clearable` when a quick erase action is helpful. The pressable delete affordance only appears while the field is focused and populated.

`SelectField` presents the selected value/placeholder, announces its value to screen readers, and opens the caller's location/date selection action. `CountrySelect` uses the same select chrome and `TextField` for modal search.

`PhoneNumberField` shares the outer field frame, but keeps the dialing code and entered number in **LTR** order, preserves leading zeros in the entered national number, and strips them only on E.164 conversion as before.

Do not use an ad hoc `TextInput` with independent border/radius/colors for new user-data forms; extend these shared controls instead. OTP digit boxes are a purpose-built verification control and are intentionally separate.
