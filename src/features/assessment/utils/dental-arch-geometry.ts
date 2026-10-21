/** Pure layout math for two curved dental arches, independent of screen pixels. */
export const PERMANENT_UPPER = [
  '18',
  '17',
  '16',
  '15',
  '14',
  '13',
  '12',
  '11',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
] as const;
export const PERMANENT_LOWER = [
  '48',
  '47',
  '46',
  '45',
  '44',
  '43',
  '42',
  '41',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
] as const;
export const PRIMARY_UPPER = ['55', '54', '53', '52', '51', '61', '62', '63', '64', '65'] as const;
export const PRIMARY_LOWER = ['85', '84', '83', '82', '81', '71', '72', '73', '74', '75'] as const;

export interface DentalArchPoint {
  code: string;
  x: number;
  y: number;
  lower: boolean;
}

/** Coordinates represent a front-facing mouth. Left of screen = patient's right. */
export function dentalArchPoints(
  codes: readonly string[],
  width: number,
  lower: boolean,
): DentalArchPoint[] {
  const centerX = width / 2;
  const radiusX = Math.max(50, (width - 62) / 2);
  const radiusY = Math.min(88, radiusX * 0.71);
  const baseline = lower ? 221 : 121;
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
