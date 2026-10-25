import { useRouter } from 'expo-router';
import { Chip } from 'heroui-native';
import { useState } from 'react';
import { View } from 'react-native';

import { ProfileScreenShell } from '@/features/profile/components/profile-screen-shell';
import { useFamilyMembers } from '@/features/profile/state/family-members-store';
import { AppText, Button, TextField } from '@/shared/components/ui';

const relations = [
  'ابني',
  'ابنتي',
  'أخي',
  'أختي',
  'والدي',
  'والدتي',
  'زوجي',
  'زوجتي',
  'قريب آخر',
] as const;

/** A family list entry, not a representation/grant request. */
export function AddDependentScreen() {
  const router = useRouter();
  const { addMember } = useFamilyMembers();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [relation, setRelation] = useState('');
  const numericAge = Number(age);
  const validAge =
    /^\d{1,3}$/.test(age) && Number.isInteger(numericAge) && numericAge >= 0 && numericAge <= 120;
  const canSubmit =
    name.trim().length >= 2 && name.trim().length <= 100 && validAge && Boolean(relation);

  return (
    <ProfileScreenShell
      eyebrow="أفراد الأسرة"
      title="إضافة فرد من الأسرة"
      description="ثلاث معلومات بسيطة لحتى تضيف الشخص إلى قائمة أسرتك."
    >
      <View className="gap-4">
        <TextField
          label="الاسم الكامل"
          placeholder="اسم فرد الأسرة"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          maxLength={100}
          clearable
        />
        <TextField
          label="العمر"
          placeholder="العمر بالسنوات"
          value={age}
          onChangeText={(value) => setAge(value.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          maxLength={3}
          error={age && !validAge ? 'أدخل عمر بين 0 و120 سنة' : undefined}
          helperText="إذا كان عمره أقل من سنة، اكتب 0."
        />
        <View className="gap-2">
          <AppText align="right" variant="label" className="font-ui-semibold">
            صلة القرابة
          </AppText>
          <View className="flex-row-reverse flex-wrap gap-2">
            {relations.map((option) => (
              <Chip
                key={option}
                variant={relation === option ? 'primary' : 'soft'}
                color={relation === option ? 'accent' : 'default'}
                size="lg"
                accessibilityRole="radio"
                accessibilityState={{ checked: relation === option }}
                onPress={() => setRelation(option)}
              >
                <Chip.Label>{option}</Chip.Label>
              </Chip>
            ))}
          </View>
        </View>
        <Button
          label="إضافة فرد الأسرة"
          className="mt-2 h-[50px] rounded-[12px]"
          disabled={!canSubmit}
          onPress={() => {
            if (!canSubmit) return;
            addMember({ name: name.trim(), age: numericAge, relation });
            router.back();
          }}
        />
        <AppText align="right" variant="caption" className="text-content-secondary">
          رح يظهر الشخص ضمن أفراد أسرتك. الحجز باسمه أو الاطلاع على بياناته الطبية بيحتاج صلاحية
          مستقلة إذا كانت مطلوبة.
        </AppText>
      </View>
    </ProfileScreenShell>
  );
}
