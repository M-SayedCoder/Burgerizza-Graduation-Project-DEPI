import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MdDashboard, MdRestaurantMenu, MdReceipt,
  MdEventSeat, MdInventory, MdLogout,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const links = [
  { name: 'Dashboard', path: '/', icon: MdDashboard },
  { name: 'Menu', path: '/menu', icon: MdRestaurantMenu },
  { name: 'Orders', path: '/orders', icon: MdReceipt },
  { name: 'Reservations', path: '/reservations', icon: MdEventSeat },
  { name: 'Inventory', path: '/inventory', icon: MdInventory },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser, user } = useAuth();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'You will be redirected to the login page.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Logout',
    });
    if (result.isConfirmed) {
      logoutUser();
      navigate('/login');
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed flex flex-col z-40">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-orange-500">Burgerizza</h1>
        <p className="text-xs text-slate-400 mt-1">Manager Panel</p>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {links.map(({ name, path, icon: Icon }) => {
            const active = path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(path);
            return (
              <li key={name}>
                <Link
                  to={path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="text-xl flex-shrink-0" />
                  <span className="text-sm font-medium">{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-3 border-t border-slate-800">
        {user && (
          <div className="px-4 py-3 mb-1">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <MdLogout className="text-xl" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
