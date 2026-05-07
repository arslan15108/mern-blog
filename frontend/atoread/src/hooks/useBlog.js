import { useDispatch, useSelector } from "react-redux";
import {
  addBlog,
  blogDetail,
  fetchBlog,
  setError,
  setPostLoading,
  likePost,
  clearMessages,
} from "../store/slices/blogSlice";

import api from "../services/axios";

export const useBlog = () => {
  const { blogs, details, postLoading, error, successMessage, isLike } = useSelector(
    (state) => state.blog
  );

  const dispatch = useDispatch();

  // 🔹 Get all blogs
  const getBlogs = async () => {
    try {
      dispatch(setPostLoading(true));

      const res = await api.get("/blog/get-all-posts");

      dispatch(fetchBlog(res.data));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || error.message)
      );
    }
  };

  // 🔹 Get recent posts
  const getRecentPosts = async () => {
    try {
      dispatch(setPostLoading(true));

      const res = await api.get("/blog/get-recent-posts");

      dispatch(fetchBlog(res.data));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || error.message)
      );
    }
  };


  // 🔹 Create blog
  const createBlog = async (blogData) => {
    try {
      dispatch(setPostLoading(true));
      const res = await api.post("/blog/add", blogData);
      dispatch(addBlog(res.data.data)); // ✅ pass only the blog, not full response
      return res;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || error.message));
    }
  };


  const getPostDetails = async (slug) => {

    try {
      dispatch(setPostLoading(true));
      const res = await api.get(`/blog/post-detail/${slug}`);
      dispatch(blogDetail(res?.data));
      return res?.data;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || error.message)
      )
    }
  }

  const handleLike = async (slug) => {
    try {
      const res = await api.post(`/blog/like/${slug}`);
      console.log(res, "response of like post");

      const response = dispatch(likePost(res?.data));

      return res?.data;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || error.message)
      )
    }
  }

  return {
    blogs,
    details,
    postLoading,
    error,
    successMessage,
    isLike,

    getBlogs,
    getRecentPosts,
    createBlog,
    getPostDetails,
    handleLike,
    clearMessages: () => dispatch(clearMessages()),
  };
};