import { StatusIndicator } from '@/shared/components/ui/status-indicator';
import type { StatusTone } from '@/shared/components/ui/status-indicator';

export type { StatusTone };

interface StatusTagProps {
  label: string;
  tone?: StatusTone;
}

export function StatusTag({ label, tone = 'neutral' }: StatusTagProps) {
  return <StatusIndicator emphasis="subtle" label={label} tone={tone} />;
}
