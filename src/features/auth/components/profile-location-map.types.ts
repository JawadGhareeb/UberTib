export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface ProfileLocationMapProps {
  coordinate: Coordinate;
  onChange: (coordinate: Coordinate) => void;
  onInteractiveChange?: (available: boolean) => void;
  /** Increment only on explicit device-location recenter, not map panning. */
  recenterToken?: number;
}
