import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import api from "../services/axios";
import { useSelector } from "react-redux"; // or however you access current user
import { useAuth } from "../context/AuthContext";

const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const {user} = useAuth(); // ✅ get current user
    
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res.data.data.notifications);
      setUnreadCount(res.data.data.unreadCount);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

// split into two effects
useEffect(() => {
    console.log(user,"user");
    
  fetchNotifications();
}, []);

useEffect(() => {
  if (!user?.data?._id) return;

  const socket = io(import.meta.env.VITE_API_URL, {
    query: { userId: user?.data?._id },
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => console.log("✅ connected:", socket.id));
  socket.on("connect_error", (err) => console.log("❌ error:", err.message));
  socket.on("new_notification", (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  });

  return () => socket.disconnect();
}, [user?.data?._id]); // ✅ only runs when user._id is available

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
};

export default useNotification;