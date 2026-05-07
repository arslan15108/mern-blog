import {Home, About, Blog,Login,Signup, PostDetail} from "../pages";
const generalRoutes = [
    {index: true, element: <Home /> },
    {path: 'about', element: <About /> },
    {path: 'blogs', element: <Blog />},
    {path: 'post/:slug', element: <PostDetail />}
]

export default generalRoutes;