import React from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const ManageTasks = () => {
  useUserAuth();
  return (
    <DashboardLayout activeMenu="Manage Tasks">Manage Tasks</DashboardLayout>
  );
};

export default ManageTasks;
