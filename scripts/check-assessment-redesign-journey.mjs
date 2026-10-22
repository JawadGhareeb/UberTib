import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const read = (path) => readFileSync(path, 'utf8');
const geometrySource = read('src/features/assessment/utils/dental-arch-geometry.ts');
const compiled = ts.transpileModule(geometrySource, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const geometry = await import(
  'data:text/javascript;base64,' + Buffer.from(compiled).toString('base64')
);
const {
  PERMANENT_UPPER,
  PERMANENT_LOWER,
  PRIMARY_UPPER,
  PRIMARY_LOWER,
  dentalArchPoints,
  toothShapeForCode,
} = geometry;

assert.deepEqual(
  [...PERMANENT_UPPER],
  ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'],
);
assert.deepEqual(
  [...PERMANENT_LOWER],
  ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'],
);
assert.equal(PRIMARY_UPPER.length + PRIMARY_LOWER.length, 20);
assert.equal(new Set([...PERMANENT_UPPER, ...PERMANENT_LOWER]).size, 32);
assert.equal(new Set([...PRIMARY_UPPER, ...PRIMARY_LOWER]).size, 20);
assert.equal(toothShapeForCode('14'), 'premolar');
assert.equal(toothShapeForCode('54'), 'molar');
for (const width of [270, 300, 320, 380]) {
  const upper = dentalArchPoints(PERMANENT_UPPER, width, false);
  const lower = dentalArchPoints(PERMANENT_LOWER, width, true);
  assert.equal(upper.length, 16);
  assert.equal(lower.length, 16);
  assert.ok(
    upper.every((point) => point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= 370),
  );
  assert.ok(
    lower.every((point) => point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= 370),
  );
  assert.ok(upper[7].y < upper[0].y, 'Upper arch must curve toward top at incisors');
  assert.ok(lower[7].y > lower[0].y, 'Lower arch must curve toward bottom at incisors');
  assert.ok(upper[0].x < upper[15].x && lower[0].x < lower[15].x, 'FDI quadrant directions stable');
  for (const codes of [PERMANENT_UPPER, PRIMARY_UPPER]) {
    const centers = dentalArchPoints(codes, width, false);
    const gaps = centers.slice(1).map((p, i) => Math.hypot(p.x - centers[i].x, p.y - centers[i].y));
    assert.ok(
      Math.max(...gaps) - Math.min(...gaps) < 1.1,
      'Teeth must be spaced by actual arch length to avoid overlapping molars',
    );
    assert.ok(Math.min(...gaps) >= 18, 'Crowns must remain distinguishable on narrow screens');
  }
}

const chart = read('src/features/assessment/components/dental-arch-selector.tsx');
const scaffold = read('src/features/assessment/components/assessment-scaffold.tsx');
const stepper = read('src/features/assessment/components/assessment-journey-progress.tsx');
const start = read('src/features/assessment/screens/assessment-start-screen.tsx');
const location = read('src/features/assessment/screens/assessment-location-screen.tsx');
const patient = read('src/features/assessment/screens/assessment-patient-screen.tsx');
const complaint = read('src/features/assessment/screens/assessment-complaint-screen.tsx');
const questions = read('src/features/assessment/screens/assessment-questions-screen.tsx');
const health = read('src/features/assessment/screens/assessment-health-screen.tsx');
const profileHealth = read('src/features/profile/screens/patient-health-information-screen.tsx');
const media = read('src/features/assessment/screens/assessment-media-screen.tsx');
const review = read('src/features/assessment/screens/assessment-review-screen.tsx');
const result = read('src/features/assessment/screens/assessment-result-screen.tsx');
assert.ok(
  chart.includes('dentalArchPoints(upper, width, false)') &&
    chart.includes('dentalArchPoints(lower, width, true)'),
);
assert.ok(
  chart.includes('<SelectableTooth') &&
    chart.includes('<DentalCrown') &&
    chart.includes('accessibilityRole="checkbox"') &&
    chart.includes('testID={`tooth-${code}`}'),
);
assert.ok(
  chart.includes('onToggleTooth(point.code)') &&
    chart.includes('selectedTeeth.includes(point.code)'),
);
assert.ok(
  chart.includes('onLayout=') && chart.includes('width={width}') && chart.includes('curve(true)'),
);
assert.ok(
  chart.includes('crownSizeFor') && chart.includes('crownSize={upperCrownSize}'),
  'Crown sizes must adapt to jaw width and tooth count',
);
assert.ok(
  chart.includes('selected ? (') &&
    chart.includes('accessibilityLabel={') &&
    chart.includes('readableToothId(code)') &&
    chart.includes('selectedTeeth.map((tooth) =>'),
  'Selected teeth expose full Arabic tooth names and remain accessible',
);

assert.ok(
  location.includes('<DentalArchSelector') &&
    location.includes('setRegionLocation(region)') &&
    !location.includes('لا أعرف السن بالتحديد'),
);
assert.ok(
  location.includes('primaryDisabled={!location}') && location.includes("returnTo === 'review'"),
);
assert.ok(location.includes('<SectionTabs'), 'Chart/region modes must use HeroUI Tabs');
assert.ok(
  read('src/features/assessment/components/dentition-mode-control.tsx').includes('<SectionTabs'),
  'Dentition mode must use HeroUI Tabs',
);
assert.ok(!complaint.includes('<TextField'), 'Extra notes must not appear in complaint choice');
assert.ok(
  questions.includes('<TextField') && questions.includes('onChangeText={setDetails}'),
  'HeroUI text field must be in symptom step',
);
assert.ok(
  media.includes('<IntroArtwork step={0} height={115} />'),
  'Upload placeholder uses visual project artwork',
);
assert.ok(
  start.includes('<IntroArtwork step={0} height={165} />'),
  'Intro tooth artwork must be reused',
);

assert.ok(
  scaffold.includes('<AssessmentJourneyProgress phase={phase} />') &&
    scaffold.includes('<AppHeader title="تحديد حالتي"') &&
    scaffold.includes('border-t border-border-subtle bg-surface-default'),
);
assert.ok(
  stepper.includes('getAssessmentStep') &&
    stepper.includes('steps.length') &&
    stepper.includes('accessibilityRole="progressbar"'),
);
assert.ok(
  stepper.includes('{number}/{steps.length}') &&
    stepper.includes('height: 6') &&
    stepper.includes('direction="ltr"'),
  'Step progress must display 1/8 format with a visible single rail',
);
assert.ok(
  location.includes('solidActive') &&
    read('src/features/assessment/components/dentition-mode-control.tsx').includes('solidActive') &&
    read('src/shared/components/ui/section-tabs.tsx').includes('text-content-on-action'),
  'Selected HeroUI tabs must use brand-filled background with contrast text',
);
assert.ok(
  !chart.includes('تحديد منطقة') &&
    !chart.includes('منطقة اللثة') &&
    chart.includes('left-3') &&
    chart.includes('right-3'),
  'Dental diagram should not duplicate region buttons and must anchor directional text',
);
assert.ok(
  read('src/features/assessment/components/dentition-mode-control.tsx').includes(
    "label: 'دائمة'",
  ) &&
    read('src/features/assessment/components/dentition-mode-control.tsx').includes(
      "label: 'لبنية'",
    ) &&
    !read('src/features/assessment/components/dentition-mode-control.tsx').includes(
      "label: 'مختلطة'",
    ),
  'Dentition selector must have two visible choices',
);
assert.ok(
  review.includes('rounded-[10px] bg-action-subtle px-2') &&
    result.includes('ملخص حالتك') &&
    result.includes('المشكلة الرئيسية') &&
    result.includes('الأعراض اللي ذكرتها'),
  'Review edit actions and result summary require the revised visual rhythm',
);
assert.ok(
  !read('src/features/my-care/components/case-overview-card.tsx').includes('المرحلة الحالية') &&
    read('src/features/my-care/screens/case-timeline-screen.tsx').includes(
      'تفاصيل المرحلة الحالية',
    ) &&
    read('src/features/my-care/screens/case-timeline-screen.tsx').includes('{careCase.nextAction}'),
  'Case cards must omit the grey stage box while timeline details retain the actual stage and next action',
);
assert.ok(
  start.includes('تصفّح الخدمات') &&
    start.includes("router.push('/(tabs)/discover')") &&
    !start.includes('لديك تقييم غير مكتمل'),
);
assert.ok(
  patient.includes('ASSESSMENT_PATIENT_FIXTURES') &&
    complaint.includes('ASSESSMENT_PATIENT_FIXTURES') &&
    questions.includes('ASSESSMENT_PATIENT_FIXTURES'),
);
assert.ok(
  complaint.includes('<RadioGroup.Item') &&
    questions.includes('<Checkbox') &&
    questions.includes('onSelectedChange={() => toggleAnswer(answer)}'),
);
assert.ok(
  health.includes('<Accordion') &&
    health.includes('ASSESSMENT_PATIENT_FIXTURES') &&
    !health.includes('بنسلين — طفح جلدي سابق'),
);
assert.ok(profileHealth.includes('<Accordion') && profileHealth.includes('<HealthNoteForm'));
assert.ok(
  media.includes('onPress={openMediaSource}') &&
    media.includes('removeMediaAttachment(file.uri)') &&
    !media.includes('الجودة مناسبة'),
);
assert.ok(
  review.includes('selectedTeeth.length') &&
    review.includes('mediaAttachments.length') &&
    review.includes('primaryDisabled={!complaint || !location || !healthConfirmed}'),
);
assert.ok(
  result.includes('answers.length') &&
    result.includes('mediaAttachments.length') &&
    !result.includes('بدأ منذ 3 أيام'),
);
assert.ok(
  health.includes('assessmentPatient: patient'),
  'Health editing must carry selected patient ID',
);
assert.ok(
  profileHealth.includes('assessmentPerson') &&
    profileHealth.includes('activePatientId') &&
    profileHealth.includes('<HealthNoteList'),
  'Health information is grouped by selected patient without borrowing account-holder demo records',
);

console.log(
  'Assessment journey: shared header, 8-step single progress, crown arches 32/20 FDI, real HeroUI controls, media, health, review contracts passed.',
);
