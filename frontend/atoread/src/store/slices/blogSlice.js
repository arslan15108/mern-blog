import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    blogs: [],
    isLike: false,
    details: null,
    selectedBlog: null,
    postLoading: false,
    error: null,
    successMessage: null,
}

const blogSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        setPostLoading(state, action) {
            state.postLoading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
            state.postLoading = false;
        },
        setSuccessMessage(state, action) {
            state.successMessage = action.payload;
            state.postLoading = false;
        },
        clearMessages(state) {
            state.error = null;
            state.successMessage = null;
        },

        // Blog Crud 
        fetchBlog(state, action) {
            state.blogs = action.payload;
            state.postLoading = false;
            state.error = null;
        },
        addBlog(state, action) {
            state.blogs?.unshift(action.payload);
            state.postLoading = false;
            state.successMessage = "Blog created Successfully!"
        },
        blogDetail(state, action) {
            state.details = action.payload;
            state.postLoading = false;
            state.error = null;
        },
        likePost(state, action) {
            state.isLike = !state.isLike;
            state.postLoading = false;
            state.error = null;
        }
    }
})

export const {
    setPostLoading,
    setError,
    setSuccessMessage,
    clearMessages,
    fetchBlog,
    addBlog,
    blogDetail,
    likePost,
} = blogSlice.actions;

export default blogSlice.reducer;