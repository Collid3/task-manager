import React from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserContext } from "../../context/UserContext";

const CreateTask = () => {
  useUserAuth();

  const { me, navigate } = useUserContext();

  return (
    <DashboardLayout activeMenu="Create Task">Create Task</DashboardLayout>
  );
};

export default CreateTask;
