import { useRouter } from 'expo-router';
import { Avatar } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { usePreferredLocation } from '@/features/location/state/preferred-location-provider';
import { useAccountDetails } from '@/features/profile/state/account-details-provider';
import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { useProfilePhoto } from '@/features/profile/state/profile-photo-provider';
import { EditableProfileAvatar } from '@/shared/components/media/editable-profile-avatar';
import { ProfilePhoneChangeDialogs } from '@/features/profile/components/profile-phone-change-dialogs';
import { phoneCountries } from '@/shared/components/ui/country-select';
import { normalizeDigits } from '@/features/auth/utils/phone-input';
import type { SelectedMediaFile } from '@/shared/components/media/media-picker';
import {
  AppIcon,
  AppText,
  Button,
  PhoneNumberField,
  TextField,
  toE164,
} from '@/shared/components/ui';

function DetailRow({
  title,
  value,
  phone = false,
}: {
  title: string;
  value: string;
  phone?: boolean;
}) {
  return (
    <View className="min-h-[61px] items-end justify-center gap-1 border-b border-border-subtle px-3 py-3">
      <AppText align="right" variant="caption" className="text-content-secondary">
        {title}
      </AppText>
      <AppText
        align="right"
        direction={phone ? 'ltr' : 'rtl'}
        variant="label"
        className="font-ui-semibold"
      >
        {value}
      </AppText>
    </View>
  );
}

export function ProfilePersonalInfoScreen() {
  const router = useRouter();
  const { name, phone, city, setName } = useAccountDetails();
  const { location } = usePreferredLocation();
  const { photo, setPhoto } = useProfilePhoto();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftPhoto, setDraftPhoto] = useState<SelectedMediaFile | null>(photo);
  const currentCountry =
    phoneCountries.find((item) => phone.startsWith(item.dialCode)) ?? phoneCountries[0]!;
  const [draftCountry, setDraftCountry] = useState(currentCountry);
  const [draftNational, setDraftNational] = useState(
    normalizeDigits(phone.slice(currentCountry.dialCode.length)),
  );
  const [pendingVerificationPhone, setPendingVerificationPhone] = useState<string | null>(null);
  const newPhone = toE164(draftCountry, draftNational);
  const phoneChanged = newPhone !== phone.replace(/\s/g, '');
  const validPhone =
    /^\+[1-9]\d{7,14}$/.test(newPhone) &&
    (draftCountry.iso !== 'SY' || /^9\d{8}$/.test(normalizeDigits(draftNational)));
  const nameValid = draftName.trim().length >= 2 && draftName.trim().length <= 100;
  const canSave =
    nameValid &&
    (!phoneChanged || validPhone) &&
    (draftName.trim() !== name || draftPhoto?.uri !== photo?.uri || phoneChanged);

  const startEdit = () => {
    setDraftName(name);
    setDraftPhoto(photo);
    const country =
      phoneCountries.find((item) => phone.startsWith(item.dialCode)) ?? phoneCountries[0]!;
    setDraftCountry(country);
    setDraftNational(normalizeDigits(phone.slice(country.dialCode.length)));
    setEditing(true);
  };

  const finishSave = () => {
    setName(draftName.trim());
    setPhoto(draftPhoto);
    setEditing(false);
  };

  const save = () => {
    if (!canSave) return;
    if (phoneChanged) {
      // Do not persist any profile changes until phone verification succeeds.
      setPendingVerificationPhone(newPhone);
      return;
    }
    finishSave();
  };

  return (
    <ProfileScreenShell
      eyebrow="إدارة حسابك"
      title="إدارة حسابك"
      description="معلوماتك الشخصية وموقعك المحفوظ."
    >
      <View className="items-center gap-2">
        {editing ? (
          <EditableProfileAvatar value={draftPhoto} onChange={setDraftPhoto} />
        ) : (
          <Avatar size="lg" variant="soft" color="accent">
            {photo ? <Avatar.Image source={{ uri: photo.uri }} /> : null}
            <Avatar.Fallback />
          </Avatar>
        )}
        <AppText variant="heading-4" align="center">
          {name}
        </AppText>
        <View className="rounded-full bg-action-subtle px-3 py-1.5">
          <AppText variant="caption" className="font-ui-semibold text-content-link">
            الهاتف موثّق
          </AppText>
        </View>
      </View>

      {editing ? (
        <View className="mt-5 gap-3">
          <TextField
            label="الاسم الكامل"
            placeholder="اسمك الكامل"
            value={draftName}
            onChangeText={setDraftName}
            maxLength={100}
            clearable
          />
          <PhoneNumberField
            country={draftCountry}
            number={draftNational}
            onCountryChange={setDraftCountry}
            onNumberChange={(number) => setDraftNational(normalizeDigits(number))}
            error={phoneChanged && !validPhone ? 'أدخل رقم هاتف صالحاً قبل الحفظ.' : undefined}
            helperText="إذا غيّرت الرقم، رح يفتح تأكيد الرقم الجديد قبل حفظ التعديلات."
          />
          <View className="flex-row-reverse gap-2">
            <View className="min-w-0 flex-1">
              <Button label="حفظ المعلومات" disabled={!canSave} onPress={save} />
            </View>
            <View className="min-w-0 flex-1">
              <Button label="إلغاء" variant="outline" onPress={() => setEditing(false)} />
            </View>
          </View>
        </View>
      ) : (
        <>
          <View className="mt-5 overflow-hidden rounded-[15px] border border-border-subtle bg-surface-default">
            <DetailRow title="الاسم الكامل" value={name} />
            <DetailRow title="رقم الموبايل" value={phone} phone />
            <DetailRow title="المدينة" value={city} />
            <DetailRow title="موقعي" value={location?.label ?? 'ما تحدد موقع بعد'} />
          </View>
          <View className="mt-4">
            <Button label="تعديل المعلومات" onPress={startEdit} />
          </View>
        </>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="تغيير موقعي على الخريطة"
        onPress={() => router.push('/location-picker')}
        className="mt-4 min-h-[62px] flex-row-reverse items-center gap-3 rounded-[14px] border border-border-subtle bg-surface-default px-3"
      >
        <View className="h-10 w-10 items-center justify-center rounded-[11px] bg-action-subtle">
          <AppIcon
            name={{ ios: 'mappin.and.ellipse', android: 'place', web: 'place' }}
            size={20}
            tone="action"
          />
        </View>
        <View className="min-w-0 flex-1 items-end gap-0.5">
          <AppText align="right" variant="label" className="font-ui-semibold">
            تغيير منطقتي
          </AppText>
          <AppText
            align="right"
            variant="caption"
            className="text-content-secondary"
            numberOfLines={2}
          >
            اختيار من الخريطة أو استخدام الموقع الحالي
          </AppText>
        </View>
        <AppIcon
          name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
          size={16}
          tone="secondary"
        />
      </Pressable>
      <AppText align="right" variant="caption" className="mt-2 text-content-secondary">
        يمكنك تعديل معلوماتك، وتحديد موقعك من الخريطة بشكل مستقل.
      </AppText>
      {pendingVerificationPhone ? (
        <ProfilePhoneChangeDialogs
          visible
          initialPhone={pendingVerificationPhone}
          onClose={() => setPendingVerificationPhone(null)}
          onVerified={finishSave}
        />
      ) : null}
    </ProfileScreenShell>
  );
}
