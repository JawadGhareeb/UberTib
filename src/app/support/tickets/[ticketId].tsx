import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { SupportTicketDetailScreen } from '@/features/profile/screens/support-ticket-detail-screen';

export default withAuthRequired(SupportTicketDetailScreen);