import { requestCalendarPermissions } from 'expo-calendar';
import * as LegacyCalendar from 'expo-calendar/legacy';
import { Platform } from 'react-native';

type CalendarBooking = {
  status: string;
  dateKey?: string;
  timeLabel: string;
  serviceName: string;
  providerName: string;
  branch: string;
};

/** Only an exact ISO date and an explicit Arabic-local clock time are sufficient. */
export function getBookingCalendarStart(booking: CalendarBooking): Date | undefined {
  if (booking.status !== 'confirmed' || !booking.dateKey) return undefined;

  const matchDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(booking.dateKey);
  const matchTime = /^(\d{1,2}):(\d{2})\s*([صم])$/.exec(booking.timeLabel.trim());
  if (!matchDate || !matchTime) return undefined;

  const year = Number(matchDate[1]);
  const month = Number(matchDate[2]);
  const day = Number(matchDate[3]);
  const twelveHour = Number(matchTime[1]);
  const minute = Number(matchTime[2]);
  if (twelveHour < 1 || twelveHour > 12 || minute > 59) return undefined;

  const hour = (twelveHour % 12) + (matchTime[3] === 'م' ? 12 : 0);
  const date = new Date(year, month - 1, day, hour, minute);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute ||
    date.getTime() <= Date.now()
  )
    return undefined;
  return date;
}

/**
 * OS-owned event editor: user chooses event duration and explicitly saves it.
 * Do not auto-create calendar entries, assume consent or invent a 45m duration.
 */
export async function openBookingCalendarEditor(booking: CalendarBooking): Promise<void> {
  const startDate = getBookingCalendarStart(booking);
  if (!startDate) throw new Error('calendar_date_unverified');
  if (Platform.OS === 'web') throw new Error('calendar_device_only');
  if (!(await LegacyCalendar.isAvailableAsync())) throw new Error('calendar_unavailable');

  if (Platform.OS === 'ios') {
    const permission = await requestCalendarPermissions(true);
    if (!permission.granted) throw new Error('calendar_permission_denied');
  }

  await LegacyCalendar.createEventInCalendarAsync({
    title: `${booking.serviceName} · ${booking.providerName}`,
    startDate,
    location: booking.branch,
    notes: 'موعد طبي مؤكد في أوبرطب. راجع مدة الحدث والتفاصيل قبل حفظه.',
    // No endDate: let the native editor/user choose duration.
  });
}
