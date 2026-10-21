import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { NotificationCentreScreen } from '@/features/platform';

function NotificationsRoute() {
  return <NotificationCentreScreen />;
}

export default withAuthRequired(NotificationsRoute);
