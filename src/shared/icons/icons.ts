import type { AppIconName } from '@/shared/components/ui/app-icon';

/**
 * Semantic app-wide icon registry.
 *
 * Screens should depend on these stable names, not platform icon glyph names.
 * The current renderer is AppIcon (expo-symbols); the implementation can be
 * swapped for Lucide during the HeroUI Native migration without renaming usage.
 */
export const icons = {
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  care: { ios: 'heart.fill', android: 'favorite', web: 'favorite' },
  profile: { ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' },
  family: { ios: 'person.2.fill', android: 'group', web: 'group' },
  notifications: { ios: 'bell', android: 'notifications_none', web: 'notifications_none' },
  favorite: { ios: 'heart', android: 'favorite_border', web: 'favorite_border' },
  camera: { ios: 'camera', android: 'photo_camera', web: 'photo_camera' },
  image: { ios: 'photo', android: 'image', web: 'image' },
  attachment: { ios: 'paperclip', android: 'attach_file', web: 'attach_file' },
  document: { ios: 'doc.text', android: 'description', web: 'description' },
  security: { ios: 'lock.shield.fill', android: 'lock', web: 'lock' },
  help: { ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' },
  success: { ios: 'checkmark.circle', android: 'check_circle', web: 'check_circle' },
  warning: { ios: 'exclamationmark.triangle', android: 'warning', web: 'warning' },
} as const satisfies Record<string, AppIconName>;

export type IconKey = keyof typeof icons;
