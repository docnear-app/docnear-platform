import { SimpleDashboard } from '@/components/common/dashboard/SimpleDashboard';

export const metadata = { title: 'Admin Dashboard — DocNear' };

export default function AdminDashboardPage() {
  return <SimpleDashboard portalLabel="Admin Portal" portalVariant="admin" />;
}
