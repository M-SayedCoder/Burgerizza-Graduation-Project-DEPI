import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const DashboardLayout = () => (
  <div className="flex bg-slate-50 min-h-screen">
    <Sidebar />
    <div className="flex-1 ml-64 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardLayout;
