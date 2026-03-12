import { FindDoctorPage } from '@/components/find-doctor/FindDoctorPage';

export const metadata = {
  title: 'Find Doctor | Wellness',
  description:
    'Find the right doctor near you. Filter by specialty, location, price, and availability.',
};

export default function FindDoctorRoute() {
  return <FindDoctorPage />;
}
