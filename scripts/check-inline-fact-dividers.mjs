import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Do not let the long, horizontal ruler between a patient-facing label and
// its amount/status creep back into any screen or shared component.
// Vertical timeline connectors (w-px flex-1) and section boundaries are not
// part of this rule.
const root = 'src';
const files = [];
function visit(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) visit(path);
    else if (/\.(?:tsx|jsx)$/.test(name)) files.push(path);
  }
}
visit(root);

const errors = [];
const connector =
  /(?:^|\s)(?:h-px|h-\[1px\])(?=\s)[^"'\x60\n]*\bflex-1\b|(?:^|\s)flex-1(?=\s)[^"'\x60\n]*(?:h-px|h-\[1px\])(?=\s|["'\x60])/;
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  source.split('\n').forEach((line, index) => {
    if (connector.test(line) && line.includes('className')) {
      errors.push(`${relative('.', file)}:${index + 1}: horizontal flex divider between facts`);
    }
  });
}

const plan = readFileSync('src/features/my-care/screens/treatment-plan-screen.tsx', 'utf8');
const terms = readFileSync(
  'src/features/my-care/screens/accepted-financial-terms-screen.tsx',
  'utf8',
);
for (const phrase of [
  'careCase.acceptedTotalLabel',
  'إجمالي الخطة المقبولة',
  'تقدم المراحل والأدلة',
]) {
  if (!plan.includes(phrase)) errors.push('Missing patient plan information: ' + phrase);
}
for (const phrase of [
  'mockFinancialRecord.events[0].amountLabel',
  'mockFinancialRecord.events[1].amountLabel',
  'mockFinancialRecord.events[0].dateLabel',
  'CareV5Badge label="مؤكدة"',
]) {
  if (!terms.includes(phrase)) errors.push('Missing financial history information: ' + phrase);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`No horizontal fact-connector dividers found in ${files.length} UI files.`);
}
