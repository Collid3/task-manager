import React, { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";

const UserDashboard = () => {
  const { loading, me, clearUser, navigate } = useUserContext();

  useEffect(() => {
    if (loading) return;
    if (me) return;

    clearUser();
    navigate("/login");
  }, [me, loading, clearUser, navigate]);

  return <div>UserDashboard</div>;
};

export default UserDashboard;
