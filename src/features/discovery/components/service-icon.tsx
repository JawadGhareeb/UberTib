import Svg, { Circle, G, Path } from 'react-native-svg';

import { useAppTheme } from '@/shared/theme/theme-provider';

/**
 * Dental procedure pictograms, not generic app glyphs.
 * Each family has its own procedure-specific SVG overlay so the artwork is
 * consistent across Android, iOS and web (SF Symbols differ by platform).
 * Decorative only: the adjacent visible service name is the accessible label.
 */
export type DentalServiceIconId =
  | 'extraction' | 'wisdom-teeth' | 'minor-surgery' | 'periodontics'
  | 'implant' | 'bone-graft' | 'sinus-lift' | 'surgery-complications'
  | 'crowns' | 'bridges' | 'veneers' | 'implant-prosthetics'
  | 'rehab-cosmetic' | 'root-canal' | 'root-retreatment'
  | 'broken-instrument' | 'perforation' | 'root-complications'
  | 'apical-surgery' | 'dental-checkup' | 'dental-filling'
  | 'dental-cleaning' | 'teeth-whitening' | 'pediatric-dentistry'
  | 'dentures' | 'dental-emergency';

export const dentalServiceIconIds: readonly DentalServiceIconId[] = [
  'extraction', 'wisdom-teeth', 'minor-surgery', 'periodontics',
  'implant', 'bone-graft', 'sinus-lift', 'surgery-complications',
  'crowns', 'bridges', 'veneers', 'implant-prosthetics',
  'rehab-cosmetic', 'root-canal', 'root-retreatment',
  'broken-instrument', 'perforation', 'root-complications',
  'apical-surgery', 'dental-checkup', 'dental-filling',
  'dental-cleaning', 'teeth-whitening', 'pediatric-dentistry',
  'dentures', 'dental-emergency',
] as const;

interface ServiceIconProps {
  serviceId: string;
  size?: number;
  color?: string;
}

const TOOTH = 'M14 8C19 5 22 9 24 9s5-4 10-1c5 3 4 9 2 15l-3 14c-.6 3-3.8 3-4.7 0l-3.2-9c-.4-1.2-1.8-1.2-2.2 0l-3.2 9c-1 3-4.1 3-4.7 0l-3-14c-2-6-3-12 2-15Z';

export function ServiceIcon({ serviceId, size = 28, color }: ServiceIconProps) {
  const { colors } = useAppTheme();
  const stroke = color ?? colors.action.primary;
  const soft = colors.action.subtle;
  const contrast = colors.text.secondary;
  const alert = colors.tone.warning.text;
  // Don't mislabel an unknown backend service with an unrelated dental procedure.
  // New codes need an explicit icon in the registry and a corresponding test case.
  const known = dentalServiceIconIds.includes(serviceId as DentalServiceIconId);
  if (!known) {
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" accessible={false}>
        <Circle cx={24} cy={24} r={18} stroke={contrast} strokeWidth={2} />
        <Path
          d="M18 19c0-8 12-8 12 0 0 4-6 4-6 9"
          stroke={contrast}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        <Circle cx={24} cy={34} r={1.6} fill={contrast} />
      </Svg>
    );
  }
  const icon = serviceId as DentalServiceIconId;

  const hasStandardTooth = !([
    'wisdom-teeth', 'implant', 'bone-graft', 'sinus-lift',
    'bridges', 'implant-prosthetics', 'rehab-cosmetic', 'dentures',
  ] as string[]).includes(icon);

  const detail = (() => {
    switch (icon) {
      case 'extraction':
        return <G stroke={stroke} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <Path d="M25 21 41 5m-9 0h9v9" /><Path d="m16 19 6 6" stroke={contrast} />
        </G>;
      case 'wisdom-teeth':
        return <G fill={soft} stroke={stroke} strokeWidth={1.8} strokeLinejoin="round">
          <Path d={TOOTH} transform="translate(-8 0) scale(.88)" />
          <Path d={TOOTH} transform="translate(16 7) scale(.65)" />
          <Circle cx={38} cy={12} r={3} fill="none" stroke={contrast} strokeDasharray="2 2" />
        </G>;
      case 'minor-surgery':
        return <G stroke={stroke} strokeWidth={2.2} strokeLinecap="round" fill="none">
          <Path d="m5 36 30-30 6 6-30 30m16-28 6 6" /><Path d="M6 30 15 40" stroke={contrast} strokeDasharray="2 3" />
        </G>;
      case 'periodontics':
        return <G fill="none" strokeLinecap="round">
          <Path d="M9 20q6-5 15 0t15 0" stroke={alert} strokeWidth={3} />
          <Path d="M12 25c7-3 16-3 24 0" stroke={stroke} strokeWidth={1.6} strokeDasharray="2 2" />
        </G>;
      case 'implant':
        return <G stroke={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M14 11q10-12 20 0l-3 10H17Z" fill={soft} strokeWidth={2} />
          <Path d="M24 21v19m-5-16 10 4m-10 1 10 4m-10 1 10 4m-10-14v13m10-13v13" strokeWidth={2} />
        </G>;
      case 'bone-graft':
        return <G stroke={stroke} strokeWidth={2} fill="none" strokeLinecap="round">
          <Path d="M6 29q16-10 36 0l-2 10q-16-5-32 0Z" fill={soft} />
          <Circle cx={16} cy={30} r={2} /><Circle cx={24} cy={32} r={2} /><Circle cx={32} cy={30} r={2} />
          <Path d="M24 7v13m-6-7h12" />
        </G>;
      case 'sinus-lift':
        return <G stroke={stroke} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <Path d="M5 19q19-24 38 0M9 28q15-12 30 0" /><Path d="M24 39V18m-7 7 7-7 7 7" /><Path d="M11 32q13-5 26 0" stroke={contrast} />
        </G>;
      case 'surgery-complications':
        return <G stroke={alert} strokeWidth={2} strokeLinejoin="round" fill={soft}>
          <Path d="M34 23 45 41H23Z" /><Path d="M34 29v5" strokeLinecap="round" /><Circle cx={34} cy={37} r={1} fill={alert} />
        </G>;
      case 'crowns':
        return <G stroke={stroke} strokeWidth={2} strokeLinejoin="round" fill="none">
          <Path d="M11 18 9 8l9 4 6-8 6 8 9-4-2 10Z" fill={soft} /><Path d="M12 21h24" />
        </G>;
      case 'bridges':
        return <G stroke={stroke} strokeWidth={1.9} strokeLinejoin="round" fill={soft}>
          <Path d="M8 14q5-6 10 0l-2 23q-3 4-5 0Z" /><Path d="M19 14q5-6 10 0l-2 23q-3 4-5 0Z" />
          <Path d="M30 14q5-6 10 0l-2 23q-3 4-5 0Z" /><Path d="M9 13h30" stroke={contrast} strokeWidth={2.3} />
        </G>;
      case 'veneers':
        return <G stroke={stroke} strokeWidth={2} fill="none">
          <Path d="M19 12q10-3 15 1l-2 17-8 8-5-10Z" fill={soft} />
          <Path d="m33 5 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill={soft} strokeWidth={1.5} />
        </G>;
      case 'implant-prosthetics':
        return <G stroke={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M12 14 10 7l8 3 6-7 6 7 8-3-2 7Z" fill={soft} strokeWidth={2} />
          <Path d="M13 17h22m-11 0v23m-7-19 14 5m-14 0 14 5m-14 0 14 5" strokeWidth={2} />
        </G>;
      case 'rehab-cosmetic':
        return <G stroke={stroke} fill={soft} strokeLinejoin="round" strokeWidth={1.8}>
          <Path d={TOOTH} transform="translate(-5 9) scale(.8)" />
          <Path d={TOOTH} transform="translate(14 9) scale(.8)" />
          <Path d="m24 2 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" />
        </G>;
      case 'root-canal':
        return <G stroke={stroke} strokeWidth={2} strokeLinecap="round" fill="none">
          <Path d="M19 17v12l-2 10m12-22v12l2 10" /><Circle cx={19} cy={17} r={1.8} fill={stroke} /><Circle cx={29} cy={17} r={1.8} fill={stroke} />
        </G>;
      case 'root-retreatment':
        return <G stroke={stroke} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <Path d="M21 15v17l-3 7m9-24v17l3 7" /><Path d="M35 15a12 12 0 0 0-21-4m0 0v-7m0 7h7" stroke={contrast} />
        </G>;
      case 'broken-instrument':
        return <G stroke={stroke} strokeWidth={2} strokeLinecap="round" fill="none">
          <Path d="M22 13v11m0 5v11m0-16 3 3-3 2m7-16v13l-3 3" />
          <Path d="M13 28h9" stroke={alert} strokeWidth={2.5} />
        </G>;
      case 'perforation':
        return <G stroke={stroke} strokeWidth={2} fill="none" strokeLinecap="round">
          <Path d="M20 15v21m8-21v21" /><Circle cx={33} cy={30} r={5} stroke={alert} strokeWidth={2.5} />
          <Path d="m36 30 6-3" stroke={alert} />
        </G>;
      case 'root-complications':
        return <G stroke={stroke} strokeLinecap="round" fill="none">
          <Path d="M20 16v21m8-21v21" strokeWidth={2} />
          <Circle cx={20} cy={39} r={3.5} stroke={alert} strokeWidth={2} />
          <Path d="M36 6v7" stroke={alert} strokeWidth={2.5} /><Circle cx={36} cy={17} r={1.3} fill={alert} />
        </G>;
      case 'apical-surgery':
        return <G stroke={stroke} strokeWidth={2} fill="none" strokeLinecap="round">
          <Path d="M20 15v19m8-19v19" /><Path d="M8 36h31" stroke={alert} strokeWidth={2.5} strokeDasharray="3 2" />
          <Path d="M35 31 43 26m-8 5 8 5" />
        </G>;
      case 'dental-checkup':
        return <G stroke={stroke} strokeWidth={2} fill="none">
          <Circle cx={31} cy={26} r={9} fill={soft} /><Path d="m37 33 8 8" strokeWidth={2.8} strokeLinecap="round" />
        </G>;
      case 'dental-filling':
        return <G stroke={stroke} strokeWidth={2} strokeLinejoin="round">
          <Path d="M18 13q6-5 12 0l1 8-7 4-7-4Z" fill={stroke} opacity={0.25} />
          <Path d="M19 17h10" fill="none" />
        </G>;
      case 'dental-cleaning':
        return <G stroke={stroke} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <Path d="M29 8 43 22m-11-1 5 5m-4-12 7 7M22 26l7-7" />
          <Path d="M12 27h8m-5-4h8" stroke={contrast} strokeWidth={1.4} />
          <Circle cx={37} cy={8} r={2} fill={soft} />
        </G>;
      case 'teeth-whitening':
        return <G fill={soft} stroke={stroke} strokeWidth={1.8} strokeLinejoin="round">
          <Path d="m35 3 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" />
          <Path d="m11 23 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" />
        </G>;
      case 'pediatric-dentistry':
        return <G stroke={stroke} fill={soft} strokeWidth={1.8} strokeLinejoin="round">
          <Path d={TOOTH} transform="translate(16 21) scale(.48)" />
          <Path d="M35 4v9m-4-4h8" strokeLinecap="round" />
        </G>;
      case 'dentures':
        return <G stroke={stroke} strokeLinejoin="round" strokeWidth={2} fill={soft}>
          <Path d="M6 22q18-26 36 0l-3 6q-15-15-30 0Z" />
          <Path d="M10 31q14 14 28 0l-2 7q-12 7-24 0Z" />
          <Path d="M16 15v9m8-11v11m8-9v9M19 32v7m10-7v7" strokeWidth={1.2} />
        </G>;
      case 'dental-emergency':
        return <G stroke={alert} strokeWidth={2} strokeLinejoin="round" fill={alert}>
          <Path d="M31 4 22 23h8l-8 19 20-24H32Z" />
        </G>;
    }
  })();

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" accessible={false}>
      {hasStandardTooth ? (
        <Path d={TOOTH} stroke={stroke} strokeWidth={2} strokeLinejoin="round" fill={soft} />
      ) : null}
      {detail}
    </Svg>
  );
}
