# UberTib – patient doctor display handoff (SRS v1.1 / UX V2.1)

Scope: **patient-facing doctor discovery, service-based results, doctor card, comparison, doctor profile, branch details and verified patient reviews**. This does NOT claim the backend or full SRS is implemented.

## Product flows (do not change)

- **Services**: catalog → choose a service → doctors for that service → compare up to three or view doctor → booking.
- **Help me identify my condition**: existing assessment questions and possible manual review → assessment result currently scopes to `dental-checkup` → doctors → existing comparison and booking. The assessment result is _guidance, not diagnosis_; never infer definitive treatments client-side.
- **Explore doctors**: list all doctors without forcing a service → general doctor profile → explicit service choice before appointment selection.
- Keep existing HeroUI BottomSheet filters. Do not introduce area/service quick-filter buttons or new assessment steps.

## Backend-to-frontend contract – authoritative per doctor + domain + service + branch

The application currently provides a **demonstration adapter** in `src/features/discovery/model/provider-presentation.ts`. It uses `MockProvider` only and intentionally returns **no verified eligibility, no verified date, no branch ID, no distance and no verified visit count**.

Replace the adapter with an API-backed selector while keeping its presentation semantics:

| Data field                                                     | Source / rule                                                                                  | UI fallback                                             |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `providerId`, `branchId`, `serviceCode`, `domainCode`          | Canonical backend identifiers, never inferred from display names                               | Do not book until identifiers and eligibility are valid |
| `eligibility`                                                  | Explicit backend status for provider + service + branch; `verified` / `pending` / `ineligible` | Show pending and do not say “مؤهل”                      |
| `scientific` (S)                                               | Backend-issued clinical grade A/B/C/D/F or pending for domain + branch + measurement period    | “قيد التقييم”, not a default A/B grade                  |
| `pricing` (P)                                                  | Backend-provided pricing category, independent from actual declared service price              | “الفئة السعرية غير محددة”                               |
| `protection` (H)                                               | Backend decision and conditions; null means no active confirmed protection                     | Do not promise any entitlement or compensation          |
| `rating` (R) and verified visit count                          | Published, moderated patient-experience score and actual count                                 | No social rating interpreted as clinical grade          |
| `verifiedAt`, `evidenceStatus`, `period`                       | Verified issuance date, evidence validity, published effective period                          | “آخر تحقق معتمد: غير متاح”                              |
| `distanceKm` / latitude / longitude                            | Only from a _verified_ branch location and user consent if needed                              | “المسافة غير متاحة” and no fake map pin                 |
| `professionalBio`, credentials                                 | Approved professional details and documents, with publication/verification status              | Explicit unavailable state; do not invent diplomas      |
| `branchAddress`, hours, access instructions, photos, equipment | Authorized branch-level records, status and last verification                                  | Explicit demo/unavailable state; no fictitious address  |
| `price`                                                        | Amount or range, currency, included items, exclusions, price-after-exam flag                   | Service-specific price or honest “بعد الفحص”            |
| `nextAvailableSlot`                                            | Future branch/provider/service-specific availability, with timezone                            | No legacy dates; “غير متاح”                             |
| `assessmentContext`                                            | Original assessment draft and the authorized, non-diagnostic referral context                  | Keep assessment draft and patient route parameters      |

**Security / clinical correctness**: Never show internal risk indicator `I`; do not claim a patient is entitled to H. Clinical grade is not a general doctor rank. Never merge different branches or domains, average grades, or promote unverified mock data to published eligibility.

**Booking gate**: On continuing to slots and before final submission, backend must revalidate doctor + service + branch + slot + applicable pricing/protection. Frontend must display a meaningful stale-data/changed-price/unavailable-slot state and allow reselection. User cannot book when eligibility is pending/ineligible.

## UI surface mapping

| Screen/component                                                       | UI state now                                                                                                                                                                                                                                        | API hookup                                                                        |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `discover-doctor-result-card.tsx` + `provider-service-facts-strip.tsx` | Both entry points use one compact doctor card. The card shows service-specific price/slot when selected; otherwise service count and service-dependent appointment prompt. No raw S/P/H pill strip. Mock distances are populated for design review. | Inject a service+branch presentation record                                       |
| `provider-comparison-screen.tsx` + `provider-comparison.ts`            | Same-service comparison adds S/P/H, eligibility, update and distance rows with honest unavailable values                                                                                                                                            | Reuse the exact records as list and profile; same service context                 |
| `provider-decision-screen.tsx` + `doctor-classification-details.tsx`   | General browsing allowed; service-specific facts shown only on explicit selection; credentials unavailable state                                                                                                                                    | Verified credentials, domain/branch-period facts and actual branch services       |
| `provider-branch-screen.tsx`                                           | Branch display, demo equipment, missing verification/access details clearly marked                                                                                                                                                                  | Branch identity, approved hours/photos/equipment/access instructions, coordinates |
| `provider-reviews-screen.tsx`                                          | Demo ratings and comments clearly marked                                                                                                                                                                                                            | Moderated R score, verified visits and publication flags                          |

## Remaining integration dependencies, not fake front-end data

- **Multiple actual branches per doctor and per-branch grade/service eligibility**: Requires canonical branch IDs and service offerings, not the current mock grouping by name+area. The existing single-branch UI cannot be declared fully multi-branch ready until those records and behavior are tested.
- **Service-qualified map (UX P-14)**: Requires verified coordinates/branch IDs; do not plot guessed pins.
- **Authoritative rank/“most suitable” ordering**: Backend contract and policy required. Today “default” order is a mock list, **not** individualized medical suitability.
- **Saved doctor favorites (SRS P-UI-09)**: Requires a persistence/identity contract before labeling an action as saved across sessions.
- **Verification badge/date**: Dates in mock fixtures are not proof of verification; only backend evidence status may enable the “verified” claim.
- **S/P/H assignment and rechecks**, **real-time availability**, **moderated ratings**, **clinical eligibility engine** and **price/protection policy** remain backend responsibilities.

## Acceptance checks when API is connected

1. Three entry flows preserve their context. Doctor browsing does not silently select a service.
2. A doctor offered for service X/branch Y has verified eligibility for X/Y, even if another branch is eligible.
3. All displayed S/P/H/date/branch facts agree on card, comparison and profile; grades remain separate by field, branch, period.
4. A doctor with pending/F/ineligible qualification is never advertised as verified or allowed to book an unauthorized service.
5. Price unknown, no protection, no reviews, missing distance, missing verified date and no slots are unambiguous.
6. Only actual verified future slots appear. Slot/service switching clears stale booking context.
7. Two/three-doctor comparison remains in the same service context; return/navigation retains the original assessment or catalog route.
8. Arabic RTL layout and light/dark theme are tested on a real Android/iOS device with genuine API test data.

References: **UberTib SRS Etkan v1.1** P-UI-07 through P-UI-15, **UberTib UX V2.1** P-12 through P-18, **المرجع الموحد للتصنيف والنظام المالي** for non-general, evidence-based classification.

## October 24 UI completion addendum (map intentionally postponed)

- **Favorites P-UI-09 / P-45**: doctor cards and profiles now offer a favorite action, with a saved-doctor list at `/discover/favorites` accessed from existing account shortcuts. Comparison requires a chosen service and up to three providers, and returns to the favorite list. This is **device-local demo storage**, not account-synced; data are cleared on sign out. Replace storage/state with authenticated, per-patient favorites API before production.
- **Branch choice P-UI-10 / P-16**: `provider-branch-options.ts` and `provider-branch-chooser.tsx` support displaying an existing doctor's available branches in the doctor profile. Changing branch clears the selected service; branch-specific services determine whether booking can continue. **The mock offers only one branch per doctor and supplies no canonical `branchId`, so the additional choices do not appear until real branch data are available.** Do not fabricate another facility for demos.
- **Appointment checks P-UI-15 / P-20**: the slot, patient and review steps filter out past mock dates and recheck that the selected date/slot/service remain in the snapshot. The booking review retains existing mock revalidation states for unavailable slot, lost eligibility, unavailable branch and unpublished service.
- **Price revisions / consent**: a `priceAtSelection` display snapshot moves with the booking route and saved draft; if the quoted display label differs at review, the user must explicitly approve the updated displayed price before sending a request. This is a UI/demo guard **not a financial calculation or server-side agreement**. Real backend must provide structured monetary amounts, currency, signed quote version, expiry, branch/service identity and consent receipt; it must revalidate them atomically on booking submission.
- **Branch IDs**: an optional real `branchId` is forwarded through profile → slots → patient → review and saved draft where available. The current mock deliberately leaves it null. Real API integration must validate this ID and the selected branch's service eligibility, availability and prices.
- **Deferred per user request**: map of eligible branches P-14, precise coordinates and map route UI. No fake pins were added. Existing "search for branch" external web map action remains unchanged.
- **Unchanged by design**: assessment steps; service-first discovery and compare; general doctor browsing without forced service; the existing HeroUI filter sheet; visual theme, Arabic RTL, booking-step sequence, and the mock provider/service fixtures.
- **Testing limitation**: successful TypeScript, lint and Expo exports are not device-level acceptance testing. Legacy project scripts have independent failures unrelated to these modifications and still require explicit adjudication before declaring complete SRS compliance.

## UI correction – 24 October 2026

- List cards on both general doctor search and service-based results now share the **same visual structure**: provider details, compact two-column details, and consistent profile/compare buttons. Do not reintroduce the additional raw S/P/H badge strip in the doctor result card.
- A fixed area-based **distance fixture** (`getMockProviderDistanceKm`) makes the distance field visible in card and comparison for UI development. It is not derived from patient GPS, is not an ETA, and must be replaced by authorized API distance measurements before release. No guessed map coordinates were added.
- Result and comparison screens use patient-readable labels and concise copy. Service-specific S/P/H data remain in the designated profile/comparison details rather than badges crowded into search cards.
- Navigation retains RTL slide behavior but reduces its configured duration; tabs load lazily. Doctor and service lists use virtualized `FlatList` rendering. Typecheck/bundling do not measure interaction-to-navigation time on actual devices; profile responsiveness on Android/iOS remains a release verification requirement.

## Doctor classification badges + grade tabs — 24 October 2026

Product decision for the patient UI: the **mock doctor cards and profile** show doctor-level scientific/price/protection classification via three adjacent HeroUI Native `Chip` badges, independent of the currently chosen service. Service-specific prices and appointments remain bound to the selected service. Both doctor discovery and service-scoped result screens expose HeroUI Native `Tabs` for the available grades A/B/C/D/F/pending plus All. A doctor may appear in multiple tabs because separate scientific/pricing/protection badges may hold different grades; labels show which category each grade belongs to. Tab filtering never resets comparison selection or booking context.

Important: the technical classification reference still defines **authoritative clinical grading per doctor + domain + branch + measurement period**, not a globally averaged clinical grade. The front-end doctor-level badge is a mock presentation decision only; the backend owner must explicitly define the supported doctor-summary projection and must not silently merge clinical scores across fields/facilities. Do not promote the mock doctor-wide badge to a clinical claim without formal approval.

### Final badge/tabs reconciliation

- The demo grades are read without a chosen service. Profile classification details and generic doctor-to-doctor comparison display the same doctor-scoped grades. The chosen service still governs price, appointment and service eligibility.
- HeroUI Native grade tabs remain visible for all supported grade names; a grade with zero matches shows an empty state rather than removing the tab. Saved-doctor list cards share the same chip component.
- iOS and Android Expo exports verify JS bundling, not on-device tab layout or animation. Perform an on-device RTL and theme review before release.
