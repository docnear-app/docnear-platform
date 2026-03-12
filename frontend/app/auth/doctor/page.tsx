import { DoctorAuthPage } from '@/modules/auth/doctor/DoctorAuthPage';

export const metadata = { title: 'Doctor Portal — DocNear' };

interface PageProps {
  searchParams: Promise<{ mode?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { mode } = await searchParams;
  return <DoctorAuthPage defaultView={mode === 'login' ? 'login' : 'register'} />;
}
