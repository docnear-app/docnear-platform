import { SimpleDashboard } from '@/components/common/dashboard/SimpleDashboard';

export const metadata = { title: 'Patient Dashboard — DocNear' };

export default function PatientDashboardPage() {
  return <SimpleDashboard portalLabel="Patient Portal" portalVariant="patient" />;
}
