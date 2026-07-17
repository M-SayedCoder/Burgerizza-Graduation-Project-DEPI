import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../services/notificationService';
import { Notification } from '../../types/notification';
import { MdClose, MdDone, MdDoneAll, MdDeleteSweep, MdShoppingCart, MdEventSeat, MdInventory, MdInfo } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const typeIcon = (type: Notification['type']) => {
  const cls = 'text-lg';
  if (type === 'order') return <MdShoppingCart className={`${cls} text-orange-500`} />;
  if (type === 'reservation') return <MdEventSeat className={`${cls} text-blue-500`} />;
  if (type === 'alert') return <MdInventory className={`${cls} text-red-500`} />;
  return <MdInfo className={`${cls} text-slate-400`} />;
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel = ({ isOpen, onClose }: Props) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getAll(),
    refetchInterval: 30_000, // auto-refresh every 30s
  });

  const markRead = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAll = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const deleteOne = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const clearAll = useMutation({
    mutationFn: () => notificationService.clearAll(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  const unread = notifications.filter((n) => !n.isRead).length;

  const handleNotifClick = (n: Notification) => {
    if (!n.isRead) markRead.mutate(n._id);
    if (n.link) { navigate(n.link); onClose(); }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />}

      {/* Drawer */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Notifications</h3>
            {unread > 0 && (
              <p className="text-xs text-orange-500 font-medium">{unread} unread</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                onClick={() => markAll.mutate()}
                title="Mark all as read"
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
              >
                <MdDoneAll className="text-xl" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => clearAll.mutate()}
                title="Clear all"
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-500 transition-colors"
              >
                <MdDeleteSweep className="text-xl" />
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <MdClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <span className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <MdDone className="text-5xl mb-3 text-slate-300" />
              <p className="font-medium">All caught up!</p>
              <p className="text-sm mt-1">No notifications</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={`flex gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors group ${!n.isRead ? 'bg-orange-50/50' : ''}`}
                  onClick={() => handleNotifClick(n)}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!n.isRead ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                    {typeIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold leading-tight ${!n.isRead ? 'text-slate-800' : 'text-slate-600'}`}>
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>

                  {/* Delete btn */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteOne.mutate(n._id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-red-500 transition-all flex-shrink-0"
                  >
                    <MdClose className="text-sm" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;
