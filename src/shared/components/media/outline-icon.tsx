import Svg, { Circle, Path, Rect } from 'react-native-svg';

/** Lucide-compatible outline geometry, drawn with the project's existing react-native-svg. */
export type OutlineIconName =
  | 'user-round'
  | 'mars'
  | 'venus'
  | 'calendar-days'
  | 'camera'
  | 'images'
  | 'file'
  | 'pencil'
  | 'arrow-right'
  | 'map-pin';

export function OutlineIcon({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
}: {
  name: OutlineIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === 'user-round' ? (
        <>
          <Circle cx={12} cy={8} r={5} />
          <Path d="M20 21a8 8 0 0 0-16 0" />
        </>
      ) : name === 'mars' ? (
        <>
          <Path d="M16 3h5v5" />
          <Path d="m21 3-6.75 6.75" />
          <Circle cx={10} cy={14} r={6} />
        </>
      ) : name === 'venus' ? (
        <>
          <Path d="M12 15v7" />
          <Path d="M9 19h6" />
          <Circle cx={12} cy={9} r={6} />
        </>
      ) : name === 'calendar-days' ? (
        <>
          <Rect x={3} y={3} width={18} height={18} rx={2} />
          <Path d="M8 2v4M16 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
        </>
      ) : name === 'arrow-right' ? (
        <Path d="M5 12h14m-7-7 7 7-7 7" />
      ) : name === 'map-pin' ? (
        <>
          <Path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
          <Circle cx={12} cy={10} r={2} />
        </>
      ) : name === 'camera' ? (
        <>
          <Path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
          <Circle cx={12} cy={13} r={3} />
        </>
      ) : name === 'images' ? (
        <>
          <Rect x={8} y={8} width={13} height={13} rx={2} />
          <Path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
          <Circle cx={15} cy={13} r={1} />
          <Path d="m9 20 4-4 2 2 2-2 4 4" />
        </>
      ) : name === 'file' ? (
        <>
          <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <Path d="M14 2v6h6M8 13h8M8 17h8" />
        </>
      ) : (
        <>
          <Path d="m16 5 3 3M4 20l4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11z" />
        </>
      )}
    </Svg>
  );
}
