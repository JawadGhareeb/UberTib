/** Pure layout math for two curved dental arches, independent of screen pixels. */
export const PERMANENT_UPPER = [
  '28',
  '27',
  '26',
  '25',
  '24',
  '23',
  '22',
  '21',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
] as const;
export const PERMANENT_LOWER = [
  '38',
  '37',
  '36',
  '35',
  '34',
  '33',
  '32',
  '31',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
  '48',
] as const;
export const PRIMARY_UPPER = ['65', '64', '63', '62', '61', '51', '52', '53', '54', '55'] as const;
export const PRIMARY_LOWER = ['75', '74', '73', '72', '71', '81', '82', '83', '84', '85'] as const;

export interface DentalArchPoint {
  code: string;
  x: number;
  y: number;
  lower: boolean;
}

/** Coordinates follow the chart labels: left of screen = your left, right = your right. FDI quadrants are mapped accordingly. */
export function dentalArchPoints(
  codes: readonly string[],
  width: number,
  lower: boolean,
): DentalArchPoint[] {
  const centerX = width / 2;
  const radiusX = Math.max(50, (width - 62) / 2);
  const radiusY = Math.min(88, radiusX * 0.71);
  const baseline = lower ? 252 : 115;
  // Arc-length sampling prevents molars from bunching at the sides of the U.
  const samples = 180;
  const points = Array.from({ length: samples + 1 }, (_, i) => {
    const angle = Math.PI * (1 - i / samples);
    return {
      x: centerX + radiusX * Math.cos(angle),
      y: baseline + (lower ? 1 : -1) * radiusY * Math.sin(angle),
    };
  });
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    lengths.push(lengths[i - 1]! + Math.hypot(b.x - a.x, b.y - a.y));
  }
  const total = lengths[lengths.length - 1]!;
  let segment = 1;
  return codes.map((code, index) => {
    const distance = (index / (codes.length - 1)) * total;
    while (segment < samples && lengths[segment]! < distance) segment++;
    const initial = lengths[segment - 1]!;
    const fraction = Math.max(
      0,
      Math.min(1, (distance - initial) / Math.max(0.00001, lengths[segment]! - initial)),
    );
    const previous = points[segment - 1]!;
    const next = points[segment]!;
    return {
      code,
      x: previous.x + (next.x - previous.x) * fraction,
      y: previous.y + (next.y - previous.y) * fraction,
      lower,
    };
  });
}

export function toothShapeForCode(code: string): 'incisor' | 'canine' | 'premolar' | 'molar' {
  const position = Number(code.at(-1));
  if (position <= 2) return 'incisor';
  if (position === 3) return 'canine';
  if (['5', '6', '7', '8'].includes(code[0] ?? '') && position >= 4) return 'molar';
  return position <= 5 ? 'premolar' : 'molar';
}
