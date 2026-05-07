import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message,setMessage] = useState("");
  // 🔍 fetch current user on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/current-user");
        setUser(res.data);
        setMessage(res?.data?.data?.message);
        
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
        setTimeout(()=>{setMessage("")},3000)
      }
    };

    fetchUser();
  }, []);

  // 🔐 login
  const login = async (payload) => {
    const res = await api.post("/users/login", payload);
    setUser(res?.data?.data?.user); 
    return res;
  };

  // 🚪 logout
  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (err) {}

    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);