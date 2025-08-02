import React from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const ManageUsers = () => {
  useUserAuth();
  return (
    <DashboardLayout activeMenu="Team Members">Manage Users</DashboardLayout>
  );
};

export default ManageUsers;
