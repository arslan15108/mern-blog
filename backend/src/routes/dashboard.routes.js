import { Router } from "express";
import { dashboardData } from "../controllers/blog.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/dashboard").get(verifyJwt ,dashboardData);

export default router;