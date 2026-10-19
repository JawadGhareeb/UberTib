import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

export type SupportTicketTopic = 'app' | 'account' | 'booking';

export interface LocalSupportTicket {
  id: string;
  topic: SupportTicketTopic;
  subject: string;
  description: string;
  evidenceNames: string[];
  createdAt: string;
  status: 'local-only';
}
type SupportTicketsValue = {
  tickets: LocalSupportTicket[];
  saveLocalTicket: (
    input: Pick<LocalSupportTicket, 'topic' | 'subject' | 'description' | 'evidenceNames'>,
  ) => string;
};
const Context = createContext<SupportTicketsValue | null>(null);

/** UI-only drafts until support.create/list/read and upload APIs are wired.
 * Never label a local draft as a sent ticket or suggest an SLA was accepted.
 */
export function SupportTicketsProvider({ children }: PropsWithChildren) {
  const [tickets, setTickets] = useState<LocalSupportTicket[]>([]);
  const value = useMemo<SupportTicketsValue>(
    () => ({
      tickets,
      saveLocalTicket: (input) => {
        const id = 'local-support-' + Date.now();
        setTickets((current) => [
          { ...input, id, createdAt: new Date().toISOString(), status: 'local-only' },
          ...current,
        ]);
        return id;
      },
    }),
    [tickets],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useSupportTickets() {
  const value = useContext(Context);
  if (!value) throw new Error('SupportTicketsProvider is required');
  return value;
}
export const topicTitle: Record<SupportTicketTopic, string> = {
  app: 'مشكلة بالتطبيق',
  account: 'مشكلة بالحساب',
  booking: 'استفسار عن حجز',
};
