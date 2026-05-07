import useNotification from "../../hooks/useNotification";
import { Bell } from "lucide-react";
import { useState } from "react";

const typeStyles = {
  like:    { bg: "bg-red-50",     text: "text-red-700" },
  comment: { bg: "bg-emerald-50", text: "text-emerald-700" },
  follow:  { bg: "bg-blue-50",    text: "text-blue-700" },
  post:    { bg: "bg-amber-50",   text: "text-amber-700" },
};

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotification();

  // format createdAt to relative time
  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-md border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-white/70" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-medium rounded-full min-w-[17px] h-[17px] flex items-center justify-center px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/10">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-500 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
            {loading ? (
              <p className="text-sm text-gray-400 text-center py-8">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No notifications yet
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && markAsRead(n._id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${
                    !n.isRead ? "bg-blue-50/60 dark:bg-blue-500/5" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${typeStyles[n.type]?.bg} ${typeStyles[n.type]?.text}`}>
                    {n.sender?.fullName?.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-white/80 leading-snug">
                      <span className="font-medium">{n.sender?.fullName}</span>{" "}
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;