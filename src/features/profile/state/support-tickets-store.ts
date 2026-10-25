import { create } from 'zustand';
import { registerSessionStore } from '@/shared/state/session-stores';

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
type SupportTicketsState = {
  tickets: LocalSupportTicket[];
  saveLocalTicket: (
    input: Pick<LocalSupportTicket, 'topic' | 'subject' | 'description' | 'evidenceNames'>,
  ) => string;
};

/** Local UI drafts only, not sent support tickets. */
export const useSupportTickets = create<SupportTicketsState>()((set) => ({
  tickets: [],
  saveLocalTicket: (input) => {
    const id = 'local-support-' + Date.now();
    set(({ tickets }) => ({
      tickets: [
        { ...input, id, createdAt: new Date().toISOString(), status: 'local-only' },
        ...tickets,
      ],
    }));
    return id;
  },
}));

registerSessionStore(useSupportTickets);
export const topicTitle: Record<SupportTicketTopic, string> = {
  app: 'مشكلة بالتطبيق',
  account: 'مشكلة بالحساب',
  booking: 'استفسار عن حجز',
};
