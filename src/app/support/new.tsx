import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { CreateSupportTicketScreen } from '@/features/profile/screens/create-support-ticket-screen';

export default withAuthRequired(CreateSupportTicketScreen);