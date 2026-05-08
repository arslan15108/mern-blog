import React, { useEffect, useState } from "react";
import {Navigate, Outlet } from "react-router";
import {Header, Footer, Orb} from "./components";
import { AuthProvider } from "./context/AuthContext";
import api from "./services/axios";
import {ToastContainer} from "react-toastify";
const Layout = () => {
    return (
        <>
            <Header />
            <div className="pt-[100px] dark:bg-[#0a0a0a] bg-gray-900/80 relative overflow-hidden">
                <Orb width="500px" height="500px" bg="bg-violet-300/30" className="blur-6xl -top-10" />
                <Orb width="500px" height="500px" bg="bg-amber-300/30" className="blur-6xl right-0 bottom-0" />
                <Outlet />
            </div>
            <Footer />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
            />
        </>
    );
};

export default Layout;