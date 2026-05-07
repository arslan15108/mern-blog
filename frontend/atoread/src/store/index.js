import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./slices/blogSlice";
import dashboardReducer from "./slices/dashboardSlice";
export const store = configureStore({
    reducer: {
        blog: blogReducer,
        dashboard: dashboardReducer,
    }
})