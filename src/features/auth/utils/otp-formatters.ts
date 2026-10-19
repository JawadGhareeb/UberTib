export const CODE_LENGTH = 6;

export function countdown(raw: string | undefined, defaultSeconds: number): number {
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? Math.min(Math.floor(value), 900) : defaultSeconds;
}

export function displayPhone(value?: string): string {
  if (!value) return 'رقم موبايلك';
  const international = value.replace(/[^\d+]/g, '');
  const ending = international.slice(-3);
  const prefix = international.slice(0, -Math.min(6, international.length));
  return prefix + '•••' + ending;
}

export function formatTimer(seconds: number): string {
  return (
    String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0')
  );
}
