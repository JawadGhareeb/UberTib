import { Text, View } from 'react-native';
import Svg, { Polygon, Rect } from 'react-native-svg';

/** The current Syrian flag: green/white/black bands with three red stars. */
function SyrianFlag() {
  const star = (cx: number): string =>
    Array.from({ length: 10 }, (_, index) => {
      const angle = -Math.PI / 2 + (index * Math.PI) / 5;
      const radius = index % 2 === 0 ? 4 : 1.8;
      return (
        (cx + Math.cos(angle) * radius).toFixed(2) +
        ',' +
        (15 + Math.sin(angle) * radius).toFixed(2)
      );
    }).join(' ');

  return (
    <Svg accessibilityRole="image" width={30} height={20} viewBox="0 0 48 30">
      <Rect width={48} height={10} fill="#007A3D" />
      <Rect y={10} width={48} height={10} fill="#FFFFFF" />
      <Rect y={20} width={48} height={10} fill="#000000" />
      {[13, 24, 35].map((cx) => (
        <Polygon key={cx} points={star(cx)} fill="#CE1126" />
      ))}
    </Svg>
  );
}

function regionalFlag(iso: string): string {
  return iso
    .toUpperCase()
    .replace(/[A-Z]/g, (letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)));
}

/** National flag for dialing-code selection, without relying on OS emoji for Syria. */
export function CountryFlag({ iso }: { iso: string }) {
  return (
    <View className="h-6 w-8 items-center justify-center overflow-hidden rounded-[4px] border border-border-subtle bg-surface-default">
      {iso === 'SY' ? (
        <SyrianFlag />
      ) : (
        <Text accessibilityLabel={'علم ' + iso} style={{ fontSize: 19, lineHeight: 23 }}>
          {regionalFlag(iso)}
        </Text>
      )}
    </View>
  );
}
