import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const tokens = JSON.parse(readFileSync('src/shared/theme/tokens.json', 'utf8'));
const expectedPrimary = tokens.brand.mark;
const expectedPressed = tokens.brand.mark;

for (const [name, palette] of [
  ['light', tokens.color],
  ['dark', tokens.darkColor],
]) {
  if (palette.action.primary !== expectedPrimary) {
    throw new Error(name + ': primary must use solid ' + expectedPrimary);
  }
  if (palette.action.primaryActive !== expectedPressed) {
    throw new Error(name + ': pressed primary must use ' + expectedPressed);
  }
  if (
    palette.text.link !== expectedPrimary ||
    palette.action.secondaryBorder !== expectedPrimary ||
    palette.action.secondaryText !== expectedPrimary
  ) {
    throw new Error(name + ': outline labels, icons and borders must use exact brand primary');
  }
  if (palette.text.onAction !== '#FFFFFF') {
    throw new Error(name + ': active primary labels/icons must be white');
  }
  if (palette.text.onDestructive !== '#FFFFFF') {
    throw new Error(name + ': destructive labels/icons must be white');
  }
}

if (!/^#[0-9a-fA-F]{6}$/.test(tokens.brand.mark)) {
  throw new Error('The source brand color must be a valid six-digit HEX swatch');
}

function sourceFiles(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(?:tsx?|css)$/.test(entry.name) ? [path] : [];
  });
}

const gradientPattern = /(?:linear|radial|conic)-gradient\s*\(|\b(?:Linear|Radial)Gradient\b/;
for (const file of [...sourceFiles('src'), 'global.css']) {
  if (gradientPattern.test(readFileSync(file, 'utf8'))) {
    throw new Error('Remove unsupported gradient from ' + file);
  }
}

const tabs = readFileSync('src/app/(tabs)/_layout.tsx', 'utf8');
const tabItem = readFileSync('src/shared/components/navigation/patient-tab-item.tsx', 'utf8');
if (
  !tabItem.includes("focused ? 'bg-action-primary") ||
  !tabItem.includes('activeTintColor={colors.text.onAction}') ||
  !tabItem.includes('color: colors.text.onAction')
) {
  throw new Error('Focused bottom tabs must be solid primary with white icon/text');
}

const icons = readFileSync('src/shared/components/ui/app-icon.tsx', 'utf8');
if (
  !icons.includes('primary: colors.action.primary') ||
  !icons.includes('action: colors.action.primary')
) {
  throw new Error('UI action icons must use the current primary, not the old link green');
}

const fields = readFileSync('src/shared/components/ui/field-surface.tsx', 'utf8');
if (!fields.includes('border-action-primary')) {
  throw new Error('Shared input, phone and select fields must use the primary border');
}

const tabMetrics = readFileSync('src/shared/components/navigation/patient-tab-metrics.ts', 'utf8');
const careTabs = readFileSync('src/features/my-care/components/care-v5-ui.tsx', 'utf8');
const discoveryTabs = readFileSync(
  'src/features/discovery/components/pen-discovery-ui.tsx',
  'utf8',
);
const bottomBar = readFileSync('src/shared/components/navigation/patient-bottom-bar.tsx', 'utf8');
if (
  !tabs.includes('PatientBottomBar') ||
  !bottomBar.includes('PATIENT_TAB_BAR_HEIGHT') ||
  !careTabs.includes('PatientBottomBar') ||
  !discoveryTabs.includes('PatientBottomBar') ||
  !tabMetrics.includes('PATIENT_TAB_HEIGHT = 56')
) {
  throw new Error('All patient tabs must share one compact height contract');
}

process.stdout.write('Brand color, contrast roles and solid fills are synchronized.\n');
