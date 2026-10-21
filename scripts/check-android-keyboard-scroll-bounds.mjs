import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const app = JSON.parse(read('app.json'));
assert.equal(app.expo.android.softwareKeyboardLayoutMode, 'resize', 'Android must resize the viewport when keyboard opens');

const screen = read('src/shared/components/ui/screen.tsx');
assert.ok(screen.includes("enabled={keyboardAvoiding && Platform.OS === 'ios'}"), 'Shared Screen must not add keyboard-sized padding on Android');

const filesWithScroll = [
  'src/features/auth/screens/phone-entry-screen.tsx',
  'src/features/auth/screens/code-verification-screen.tsx',
  'src/features/auth/screens/profile-setup-screen.tsx',
  'src/features/assessment/components/assessment-scaffold.tsx',
  'src/features/profile/components/profile-screen-shell.tsx',
  'src/features/booking/screens/booking-review-screen.tsx',
  'src/features/booking/screens/cancel-booking-screen.tsx',
  'src/features/booking/screens/reschedule-booking-screen.tsx',
  'src/features/my-care/screens/claims-screen.tsx',
];

for (const path of filesWithScroll) {
  const source = read(path);
  assert.ok(source.includes('<KeyboardAwareScrollView'), path + ' needs ScrollView for user-controlled scrolling');
  assert.ok(
    /<KeyboardAwareScrollView\s+enabled=\{Platform\.OS === 'ios'\}/.test(source),
    path + ' must disable the extra animated keyboard inset on Android, while retaining iOS behavior',
  );
  assert.ok(
    source.includes('keyboardShouldPersistTaps="handled"'),
    path + ' should permit interactions with the keyboard open',
  );
}

const screensWithAvoiding = filesWithScroll.slice(0, 4);
for (const path of screensWithAvoiding) {
  assert.ok(
    read(path).includes("enabled={Platform.OS === 'ios'}"),
    path + ' must not activate KeyboardAvoidingView on Android',
  );
}
console.log('Android adjustResize uses one keyboard-avoidance strategy with scroll still available; iOS avoidance stays enabled.');
