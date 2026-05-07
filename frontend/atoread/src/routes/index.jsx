import { createBrowserRouter } from "react-router";
import Layout from "../Layout";
import authRoutes from "./authRoutes";
import generalRoutes from "./generalRoutes";
import protectedRoutes from "./protectedRoutes";
import ProtectedRoute from "../components/protectedRoutes";
import { GuestRoute } from "../components";
import { NotFound } from "../pages";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            ...generalRoutes,

      // 🔒 Only for logged-out users
      {
        element: <GuestRoute />,
        children: [...authRoutes],  // login, signup
      },

      // 🔐 Only for logged-in users
      {
        element: <ProtectedRoute />,
        children: [...protectedRoutes],
      },
       {
        path: "*",
        element: <NotFound />, // your 404 component
      }
        ]
    }
])

export default router;