import { Notification } from "../models/notification.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate("sender", "fullName avatar username")
    .sort({ createdAt: -1 })
    .limit(20);

  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false
  });

  return res.status(200).json(
    new ApiResponse(200, "Notifications fetched", { notifications, unreadCount })
  );
});

const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Notification.findByIdAndUpdate(id, { isRead: true });
  return res.status(200).json(new ApiResponse(200, "Marked as read"));
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );
  return res.status(200).json(new ApiResponse(200, "All marked as read"));
});

export {
    getNotifications,
    markAsRead,
    markAllAsRead,
} 