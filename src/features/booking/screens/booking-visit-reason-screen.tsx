import { Redirect, useLocalSearchParams } from 'expo-router';

/** Legacy booking-reason deep links redirect to the new three-step journey. */
export function BookingVisitReasonScreen() {
  const { providerId, serviceCode, dateKey, dateLabel, timeLabel, patientId, reason } =
    useLocalSearchParams<{
      providerId?: string;
      serviceCode?: string;
      dateKey?: string;
      dateLabel?: string;
      timeLabel?: string;
      patientId?: string;
      reason?: string;
    }>();

  if (!dateKey || !dateLabel || !timeLabel || !patientId) {
    return (
      <Redirect
        href={{
          pathname: '/booking/slots',
          params: { providerId: providerId ?? '', serviceCode: serviceCode ?? '' },
        }}
      />
    );
  }

  return (
    <Redirect
      href={{
        pathname: '/booking/review',
        params: {
          providerId: providerId ?? '',
          serviceCode: serviceCode ?? '',
          dateKey,
          dateLabel,
          timeLabel,
          patientId,
          ...(reason ? { reason } : {}),
        },
      }}
    />
  );
}
