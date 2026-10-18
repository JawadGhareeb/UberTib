# Pen V5 booking & dental discovery redesign (2026-10-11)

**Source**: three user-supplied screenshot strips showing 12 UI examples. The original .pen editable layers/embedded assets were not made available during this implementation. Geometry/content are based on the screenshots and existing UperTip theme; this is **not a claim of pixel-perfect Pen parity**.

## Screenshot to app route mapping

| Screenshot | Page / implementation |
| --- | --- |
| سبب الزيارة | `/booking/reason` — `BookingVisitReasonScreen` (new) |
| لمن هذا الحجز؟ | `/booking/patient` — `BookingPatientSelectionScreen` (new) |
| اختيار الموعد | `/booking/slots` — `SlotSelectionScreen` |
| الحجز وتأكيد الموعد | `/booking/review` — `BookingReviewScreen` / `BookingReviewSection` |
| تم تأكيد الحجز | `/booking/[bookingId]/status` — visible only for an existing **confirmed** booking |
| حالة الطلب | the same booking-status screen for pending/other states |
| مراجعة الطلب | `/booking/review`; submission stays pending until authoritative confirmation |
| مقارنة الأطباء | `/discover/providers/compare` — `ProviderComparisonScreen` |
| التقييمات | `/discover/provider/[providerId]/reviews` — `ProviderReviewsScreen` |
| تفاصيل الخدمة | `/discover/service/[serviceCode]` — `ServiceDetailScreen` |
| الفرع | `/discover/provider/[providerId]/branch` — `ProviderBranchScreen` |
| ملف الطبيب | `/discover/provider/[providerId]` — `ProviderDecisionScreen` |

## Source colors and responsive design

Keep approved UperTip Primary `#00E0B8` instead of the darker Pen-green; use semantic `action.primary`, `action.subtle`, shared `Button` variants and icon tones. Cards keep neutral borders; warnings, actual eligibility and confirmation statuses use separate semantic colors. Reference frame approximately 390px, scrollable and fluid 360/430 widths, 16px gutters, stable 64px headers, RTL arrows/icons, 44–52px touch controls.

## Images — current source URLs

The Pen originals were **not** supplied as standalone images. These are **licensed/demo visual placeholders, not photographic evidence for any displayed provider/branch**:
- [Dental room (Ozkan Guner / Unsplash)](https://unsplash.com/photos/a-dental-room-with-a-chair-and-a-monitor-p7eQ6uf2KSE) — app URL `https://images.unsplash.com/photo-1642844771937-23accb161a3d?auto=format&fit=crop&w=1100&q=78`
- [Dental clinic consultation (Harold Hisona / Unsplash)](https://unsplash.com/photos/dentist-talking-to-patient-in-a-modern-dental-office-Bg81yWKZlMg) — app URL `https://images.unsplash.com/photo-1777331903190-341a3dd0441b?auto=format&fit=crop&w=700&q=78`
- Patient/provider demo mock avatars currently use `provider.imageUrl` (`i.pravatar.cc` mock values). Replace these by **correctly attributed, verified provider-owned images** when available.

Components: `src/features/discovery/components/provider-photo-gallery.tsx` manages remote loading, failed-image fallback, thumbnail taps and disclosure. Do not claim the preview images depict a real registered clinic. Never embed original screenshot collage itself as app content.

## Patient-safe booking status

- `/booking/reason` → `/booking/patient` → `/booking/slots` → `/booking/review`, carrying `providerId`, `serviceCode`, `patientId` and `reason`.
- An **auth gap** redirects to phone verification with all submitted draft route parameters retained.
- Slot/date changes clear the selected time. Slot revalidation and other server-authority checks still apply before a booking submission.
- A submitted request shows **pending**, not a fabricated confirmed appointment.
- `/booking/[bookingId]/status` uses existing scenario-specific `getMockBookingForScenario`; only `status === 'confirmed'` displays “تم تأكيد الحجز”.
- Reviews filters are interactive; comparison buttons navigate to the specific provider's profile or booking reason.
- **Reference demo shortlist (October 16):** Root-canal search shows Layan Yusuf, Karim Hamdan, and Rima Al-Khatib with the screenshot's ratings, compact prices and example times, all mapped to distinct canonical mock provider IDs. Root-canal comparison begins with all three checked in **mock-only** mode to mirror the approved reference. User toggles still change the live selection; real results must start with an empty selection.
- The existing confirmed booking fixture for Layan uses her updated demo name and clinic. Price and availability claims remain **static examples** and must be replaced by authoritative backend data before a production booking can be made. The root-canal list's relative time labels are intentionally screenshot fixtures, not real-time appointment availability.
- These records are demos, not authoritative bookings. No new booking is persisted by static UI work.

## Required QA

Test every route and back transition, 360/390/430, iOS/Android RTL, status/revalidation/pending, empty filters, image load failure, auth return-to, disabled actions and tap target. Run `npm run booking-ui:check`, `npm run check` and image screenshot comparison. CI currently reports failed workflows with no executed steps, so no app runtime verification has been established.
