

import { useDispatch, useSelector } from "react-redux";
import api from "../services/axios";
import {
    setDashboardLoading,
    setError,
    setSuccessMessage,
    clearMessages,
    fetchBlogData,
} from "../store/slices/dashboardSlice"
export const useDashboardApi = () => {
    const {data,dashboardLoading,successMessage,error} = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const getDashboardResponse = async () => {
        try {
            dispatch(setDashboardLoading);
            const res = await api.get("/dashboard");
            dispatch(fetchBlogData(res?.data?.data));
        } catch (error) {
            dispatch(
                setError(error.response?.data?.message || error.message)
            );
        }
    }

    return {
        data,
        error,
        dashboardLoading,
        successMessage,

        getDashboardResponse,
        clearMessages: () => dispatch(clearMessages())
    }
}
