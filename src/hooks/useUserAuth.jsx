import { useEffect } from "react";
import { useUserContext } from "../context/UserContext";

export const useUserAuth = () => {
  const { me, loading, clearUser, navigate } = useUserContext();

  useEffect(() => {
    if (loading) return;
    if (me) return;

    if (!me) {
      clearUser();
      navigate("/login");
    }
  }, [me, loading, clearUser, navigate]);
};
