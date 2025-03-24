import EmployeeTable from '@/components/EmployeeTable/EmployeeTable';
import { NavBar } from '@/components/NavBar/NavBar';

export function HomePage() {
  return (
    <>
      <NavBar />
      <EmployeeTable />
    </>
  );
}
