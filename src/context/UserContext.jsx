import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (me) return;

    const accessToken = localStorage.getItem("task-manager-token");
    if (!accessToken) {
      setLoading(false);
      return navigate("/login");
    }

    const fetchUser = async () => {
      try {
        const { data } = await api.get(API_PATHS.AUTH.PROFILE);
        setMe(data.user);
      } catch (error) {
        toast.error(error.message);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUser = (userData) => {
    setMe(userData);
    localStorage.setItem("task-manager-token", userData.token);
    setLoading(false);
  };

  const clearUser = () => {
    console.log("here");

    setMe(null);
    localStorage.removeItem("task-manager-token");
  };

  const value = { me, loading, updateUser, clearUser, navigate };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => {
  return useContext(UserContext);
};
