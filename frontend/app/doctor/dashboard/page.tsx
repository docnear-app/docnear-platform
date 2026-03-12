import { SimpleDashboard } from '@/components/common/dashboard/SimpleDashboard';

export const metadata = { title: 'Doctor Dashboard — DocNear' };

export default function DoctorDashboardPage() {
  return <SimpleDashboard portalLabel="Doctor Workspace" portalVariant="doctor" />;
}
