import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { SupportTicketListScreen } from '@/features/profile/screens/support-ticket-list-screen';

export default withAuthRequired(SupportTicketListScreen);