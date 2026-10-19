import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { ReferenceCard, ReferenceIcon } from '@/features/profile/components/patient-reference-ui';
import { useProfilePhoto } from '@/features/profile/state/profile-photo-provider';
import { EditableProfileAvatar } from '@/shared/components/media/editable-profile-avatar';
import { AppHeader } from '@/shared/components/navigation';
import { AppIcon, AppText, ReadStateBoundary, Screen } from '@/shared/components/ui';
import type { AppIconName } from '@/shared/components/ui/app-icon';
import { useMockScenario } from '@/shared/mock';
import { mockPatientWorld } from '@/shared/mock/patient.mock';
import { useAppTheme } from '@/shared/theme/theme-provider';
import { cn } from '@/shared/utils/cn';

function ProfileMenuCard({
  title,
  description,
  icon,
  onPress,
  danger = false,
}: {
  title: string;
  description: string;
  icon: AppIconName;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <ReferenceCard
        className={cn(
          'min-h-[66px] flex-row-reverse items-center gap-[9px] px-[10px] py-[9px]',
          danger && 'border-tone-danger-border bg-tone-danger-fill/70',
        )}
      >
        <ReferenceIcon icon={icon} size={37} warm={danger} />
        <View className="min-w-0 flex-1 items-end">
          <AppText
            align="right"
            className={cn('font-ui-semibold', danger && 'text-tone-danger-text')}
            numberOfLines={2}
            style={{ fontSize: 12, lineHeight: 19 }}
            variant="label"
          >
            {title}
          </AppText>
          <AppText
            align="right"
            className="mt-0.5 text-content-secondary"
            numberOfLines={2}
            style={{ fontSize: 9.5, lineHeight: 15 }}
            variant="caption"
          >
            {description}
          </AppText>
        </View>
        <AppIcon
          name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
          size={16}
          tone={danger ? 'danger' : 'secondary'}
        />
      </ReferenceCard>
    </Pressable>
  );
}

export function ProfileScreen() {
  const router = useRouter();
  const { scheme, colors, setScheme } = useAppTheme();
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const { getSurfaceState } = useMockScenario();
  const { photo, setPhoto } = useProfilePhoto();

  return (
    <Screen
      contentClassName="px-0 py-0"
      header={
        <AppHeader
          title="حسابي"
          showNotifications
          startContent={
            <Pressable
              accessibilityLabel="الإعدادات"
              accessibilityRole="button"
              className="h-11 w-11 items-center justify-center rounded-full bg-action-subtle"
              onPress={() => router.push('/profile/settings')}
            >
              <AppIcon
                name={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
                size={20}
                tone="action"
              />
            </Pressable>
          }
        />
      }
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerClassName="mx-auto w-full max-w-[430px] px-4 pb-28 pt-[7px]"
        showsVerticalScrollIndicator={false}
      >
        <ReadStateBoundary
          state={getSurfaceState('profile')}
          emptyTitle="بيانات الحساب غير متاحة"
          permissionTitle="بيانات الحساب غير متاحة"
        >
          <View className="min-h-[72px] flex-row-reverse items-center gap-3 rounded-[12px] bg-action-subtle px-3 py-[9px]">
            <EditableProfileAvatar value={photo} onChange={setPhoto} />
            <View className="min-w-0 flex-1 items-end">
              <AppText align="right" className="font-ui-bold" variant="label">
                {mockPatientWorld.account.name}
              </AppText>
              <AppText
                align="right"
                className="mt-0.5 text-content-secondary"
                style={{ fontSize: 10, lineHeight: 16 }}
                variant="caption"
              >
                {mockPatientWorld.account.phone} · الهاتف موثّق (معاينة)
              </AppText>
            </View>
          </View>

          <View className="mt-[7px] flex-row-reverse gap-[7px]">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="فتح أفراد العائلة"
              className="min-h-[52px] flex-1 flex-row-reverse items-center justify-center gap-2 rounded-[11px] border border-border-subtle bg-surface-default px-2"
              onPress={() => router.push('/profile/family')}
            >
              <AppIcon
                name={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
                size={18}
                tone="action"
              />
              <AppText
                align="center"
                className="font-ui-semibold"
                style={{ fontSize: 11, lineHeight: 18 }}
                variant="caption"
              >
                أفراد العائلة
              </AppText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="فتح معلوماتي الصحية"
              className="min-h-[52px] flex-1 flex-row-reverse items-center justify-center gap-2 rounded-[11px] border border-border-subtle bg-surface-default px-2"
              onPress={() => router.push('/profile/health')}
            >
              <AppIcon
                name={{ ios: 'heart.text.square', android: 'monitor_heart', web: 'monitor_heart' }}
                size={18}
                tone="action"
              />
              <AppText
                align="center"
                className="font-ui-semibold"
                style={{ fontSize: 11, lineHeight: 18 }}
                variant="caption"
              >
                معلوماتي الصحية
              </AppText>
            </Pressable>
          </View>

          <View className="mt-[7px] gap-[7px]">
            <ProfileMenuCard
              title="الحساب والأمان"
              description="الهاتف الموثّق · رمز الدخول · جلسات نشطة"
              icon={{ ios: 'shield.lefthalf.filled', android: 'security', web: 'security' }}
              onPress={() => router.push('/profile/security')}
            />
            <ProfileMenuCard
              title="الخصوصية والموافقات"
              description="موافقات منفصلة، عمليات وسجل لا يُستبدل"
              icon={{ ios: 'questionmark.circle', android: 'privacy_tip', web: 'privacy_tip' }}
              onPress={() => router.push('/profile/privacy')}
            />
            <ProfileMenuCard
              title="بياناتي"
              description="اطلب نسخة وتابع حالة تجهيزها"
              icon={{ ios: 'externaldrive', android: 'storage', web: 'storage' }}
              onPress={() => router.push('/profile/data')}
            />
            <ProfileMenuCard
              title="إغلاق الحساب / طلب الحذف"
              description="طلب محكوم مع توضيح الاحتفاظ قبل التأكيد"
              icon={{
                ios: 'person.crop.circle.badge.xmark',
                android: 'person_off',
                web: 'person_off',
              }}
              danger
              onPress={() => router.push('/profile/account-closure')}
            />
          </View>

          <Pressable
            accessibilityLabel="المساعدة والدعم"
            accessibilityRole="button"
            className="mt-[7px] min-h-[58px] flex-row-reverse items-center gap-[9px] rounded-[11px] border border-border-subtle bg-surface-default px-[10px] py-[7px]"
            onPress={() => router.push('/support')}
          >
            <ReferenceIcon
              icon={{ ios: 'questionmark.circle', android: 'help_outline', web: 'help_outline' }}
              size={36}
            />
            <View className="min-w-0 flex-1 items-end">
              <AppText
                align="right"
                className="font-ui-semibold"
                style={{ fontSize: 12, lineHeight: 19 }}
                variant="label"
              >
                المساعدة والدعم
              </AppText>
              <AppText
                align="right"
                className="text-content-secondary"
                style={{ fontSize: 9.5, lineHeight: 15 }}
                variant="caption"
              >
                طلب استرداد، شكوى، أو متابعة تذكرة دعم
              </AppText>
            </View>
            <AppIcon
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={16}
              tone="secondary"
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            className="mt-[7px] min-h-[48px] flex-row-reverse items-center gap-2 rounded-[11px] border border-border-subtle bg-surface-default px-[10px]"
            onPress={() => setAppearanceOpen(true)}
            accessibilityLabel={`المظهر الحالي ${scheme === 'dark' ? 'داكن' : 'فاتح'}، تغيير المظهر`}
          >
            <AppIcon
              name={{ ios: 'paintbrush', android: 'palette', web: 'palette' }}
              size={18}
              tone="action"
            />
            <AppText
              align="right"
              className="min-w-0 flex-1 font-ui-semibold"
              style={{ fontSize: 11, lineHeight: 17 }}
              variant="caption"
            >
              المظهر · {scheme === 'dark' ? 'داكن' : 'فاتح'}
            </AppText>
            <AppText className="text-content-secondary" style={{ fontSize: 9.5 }} variant="caption">
              تغيير
            </AppText>
          </Pressable>

          <View className="mt-[7px] rounded-[10px] bg-tone-warning-fill px-3 py-[9px]">
            <AppText
              align="right"
              className="text-tone-warning-text"
              style={{ fontSize: 10, lineHeight: 17 }}
              variant="caption"
            >
              الإجراءات الحساسة تتطلب إعادة التحقق من الهوية.
            </AppText>
          </View>
        </ReadStateBoundary>
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={() => setAppearanceOpen(false)}
        statusBarTranslucent
        transparent
        visible={appearanceOpen}
      >
        <Pressable
          accessibilityLabel="إغلاق اختيار المظهر"
          accessibilityRole="button"
          className="flex-1 justify-end"
          onPress={() => setAppearanceOpen(false)}
          style={{ backgroundColor: 'rgba(0,0,0,0.42)' }}
        >
          <Pressable
            className="rounded-t-[22px] px-4 pb-8 pt-4"
            onPress={(event) => event.stopPropagation()}
            style={{ backgroundColor: colors.surface.default }}
          >
            <View className="mx-auto w-full max-w-[430px] gap-3">
              <View className="flex-row-reverse items-center justify-between">
                <AppText
                  align="right"
                  className="font-ui-bold"
                  style={{ color: colors.text.primary }}
                  variant="label"
                >
                  مظهر التطبيق
                </AppText>
                <Pressable
                  accessibilityLabel="إغلاق"
                  accessibilityRole="button"
                  className="h-9 w-9 items-center justify-center rounded-full"
                  onPress={() => setAppearanceOpen(false)}
                  style={{ backgroundColor: colors.surface.subtle }}
                >
                  <AppIcon
                    name={{ ios: 'xmark', android: 'close', web: 'close' }}
                    size={17}
                    tone="secondary"
                  />
                </Pressable>
              </View>
              <AppText align="right" style={{ color: colors.text.secondary }} variant="caption">
                اختر المظهر المناسب، وسيتم حفظ اختيارك تلقائياً.
              </AppText>

              {(
                [
                  {
                    value: 'light',
                    label: 'فاتح (Light)',
                    icon: { ios: 'sun.max.fill', android: 'light_mode', web: 'light_mode' },
                  },
                  {
                    value: 'dark',
                    label: 'داكن (Dark)',
                    icon: { ios: 'moon.fill', android: 'dark_mode', web: 'dark_mode' },
                  },
                ] as const
              ).map((option) => {
                const selected = scheme === option.value;
                return (
                  <Pressable
                    accessibilityLabel={option.label}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    className="min-h-[52px] flex-row-reverse items-center gap-3 rounded-[12px] border px-3"
                    key={option.value}
                    onPress={() => {
                      setScheme(option.value);
                      setAppearanceOpen(false);
                    }}
                    style={{
                      backgroundColor: selected ? colors.action.subtle : colors.surface.default,
                      borderColor: selected ? colors.action.primary : colors.border.default,
                    }}
                  >
                    <AppIcon name={option.icon} size={20} tone="action" />
                    <AppText
                      align="right"
                      className="min-w-0 flex-1 font-ui-semibold"
                      style={{ color: colors.text.primary }}
                      variant="label"
                    >
                      {option.label}
                    </AppText>
                    {selected ? (
                      <AppIcon
                        name={{
                          ios: 'checkmark.circle.fill',
                          android: 'check_circle',
                          web: 'check_circle',
                        }}
                        size={20}
                        tone="action"
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
