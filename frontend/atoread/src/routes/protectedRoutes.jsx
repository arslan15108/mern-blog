import { Dashboard, Profile } from "../pages";
import AddBlog from "../pages/Blog/AddBlog";

const protectedRoutes = [
  { path: "dashboard", element: <Dashboard /> },
  { path: "profile", element: <Profile /> },
  { path: "new-post", element: <AddBlog /> },
];

export default protectedRoutes;