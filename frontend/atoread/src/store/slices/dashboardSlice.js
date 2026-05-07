import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    data: null,
    dashboardLoading: false,
    error: null,
    successMessage: null,
}

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setDashboardLoading(state, action) {
            state.dashboardLoading = action.payload;
        },
        setError(state,action){
            state.error = action.payload;
            state.dashboardLoading = false;
        },
        setSuccessMessage(state, action) {
            state.successMessage = action.payload;
            state.dashboardLoading = false;
        },
         clearMessages(state) {
            state.error = null;
            state.successMessage = null;
        },

        fetchBlogData(state,action) {
            state.data = action.payload;
            state.postLoading = false;
            state.error = null; 
        }
    }
})

export const {
    setDashboardLoading,
    setSuccessMessage,
    setError,
    clearMessages,
    data,
    successMessage,
    error,
    dashboardLoading,
    fetchBlogData,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;