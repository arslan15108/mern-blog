import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { addBlog, deleteAllPosts, getPosts, getPublishedPosts, getRecentPosts, postDetails, toggleLikePost } from "../controllers/blog.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/add").post(verifyJwt,
    upload.fields([
        {
            name: 'image',
            maxCount: 1,
        }
    ]),
    addBlog
);

router.route("/get-all-posts").get(getPosts);
router.route("/get-recent-posts").get(getRecentPosts);
router.route("/post-detail/:slug").get(postDetails);
router.route("/delete-all-posts").delete(deleteAllPosts);
router.route("/published-posts").get(getPublishedPosts);
router.route("/like/:slug").post(verifyJwt, toggleLikePost);


export default router;