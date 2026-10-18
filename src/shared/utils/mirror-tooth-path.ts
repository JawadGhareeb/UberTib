/**
 * Mirror an SVG tooth silhouette 180 degrees about the fixed 20 x 38
 * dental-path coordinate system, without using a renderer SVG transform.
 *
 * The Pen tooth exports use an absolute initial M followed by relative
 * l/q/c segments and z. Keeping the mirror in path data avoids inconsistent
 * rotate(angle cx cy) handling on React Native / SVG web renderers, which
 * previously showed only small fragments of lower-arch teeth.
 */
export function mirrorToothPath(path: string): string {
  const tokens = path.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?/gi);
  if (!tokens) return path;

  let command = '';
  let coordinateIndex = 0;

  return tokens
    .map((token) => {
      if (/^[a-zA-Z]$/.test(token)) {
        command = token;
        coordinateIndex = 0;
        if (!['M', 'l', 'q', 'c', 'z'].includes(command)) {
          throw new Error(`Unsupported tooth path command: ${command}`);
        }
        return token;
      }

      const value = Number(token);
      const axis = coordinateIndex % 2;
      coordinateIndex += 1;

      // Initial move is absolute; subsequent exported commands are relative.
      if (command === 'M') return String((axis === 0 ? 20 : 38) - value);
      return String(-value);
    })
    .join(' ');
}
