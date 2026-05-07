import { Router } from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notification.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyJwt, getNotifications);
router.patch("/:id/read", verifyJwt, markAsRead);
router.patch("/read-all", verifyJwt, markAllAsRead);

export default router;