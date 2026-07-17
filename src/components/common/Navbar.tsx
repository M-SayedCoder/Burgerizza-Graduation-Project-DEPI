import { useState } from 'react';
import { MdNotifications, MdAccountCircle } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../../services/notificationService';
import NotificationsPanel from './NotificationsPanel';
import ProfileModal from './ProfileModal';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard Overview',
  '/menu': 'Menu Management',
  '/orders': 'Orders Management',
  '/reservations': 'Reservations',
  '/inventory': 'Inventory',
};

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? 'Manager Dashboard';

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Get notifications to display the unread badge
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getAll(),
    refetchInterval: 30_000,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-30">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative text-slate-400 hover:text-slate-700 transition-colors"
          >
            <MdNotifications className="text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          <div
            className="flex items-center gap-2 pl-4 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsProfileOpen(true)}
          >
            {user?.name ? (
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <MdAccountCircle className="text-3xl text-slate-300" />
            )}
            <div>
              <p className="text-sm font-medium text-slate-700 leading-none">{user?.name ?? 'Manager'}</p>
              <p className="text-xs text-slate-400 capitalize mt-0.5">{user?.role ?? 'manager'}</p>
            </div>
          </div>
        </div>
      </header>

      <NotificationsPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};

export default Navbar;
