import { withAuthRequired } from '@/features/auth/components/with-auth-required';
import { DataExportRequestScreen } from '@/features/profile';

function DataExportRequestRoute() {
  return <DataExportRequestScreen />;
}

export default withAuthRequired(DataExportRequestRoute);
