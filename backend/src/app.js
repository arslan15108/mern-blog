import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ApiError } from './utils/ApiError.js';

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim()) || [];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
}));


app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static('public'));
app.use(cookieParser());

// routes import
import userRouter from './routes/user.routes.js';
import blogRouter from './routes/blog.routes.js';
import dashboardRotuer from "./routes/dashboard.routes.js";
import notificationRouter from "./routes/notification.route.js";

app.use("/api/users", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/", dashboardRotuer); 
app.use("/api/notifications", notificationRouter);

// Global error handler middleware
app.use((err, req, res, next) => {
  let error = err;

  // If it's an ApiError instance, use it directly
  if (err instanceof ApiError) {
    error = err;
  } else {
    // For other errors, create an ApiError instance
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    error = new ApiError(statusCode, message);
  }

  // Send error response
  return res.status(error.statusCode).json({
    statusCode: error.statusCode,
    data: error.data,
    message: error.message,
    success: error.success,
    errors: error.errors,
  });
});

export { app };