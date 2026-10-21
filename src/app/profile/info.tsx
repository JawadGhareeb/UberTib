import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { ProfilePersonalInfoScreen } from '@/features/profile/screens/profile-personal-info-screen';

export default withAuthRequired(ProfilePersonalInfoScreen);
