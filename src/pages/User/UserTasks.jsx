import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/TaskCard";

const UserTasks = () => {
  const [tabs, setTabs] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const { data } = await api.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      console.log(data);

      setAllTasks(
        data?.tasksData?.tasks.length > 0 ? data.tasksData.tasks : []
      );
      const statusSummary = data?.tasksData.statusSummary || {};

      const statusArray = [
        { label: "All", count: statusSummary.allTasks || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClick = (taskId) => {
    navigate(`/admin/create-task/${taskId}`);
  };

  useEffect(() => {
    getAllTasks(filterStatus);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl font-medium md:text-xl">My Tasks</h2>

          {tabs[0]?.count > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks?.map((task, index) => (
            <TaskCard
              key={index}
              title={task.title}
              description={task.description}
              priority={task.priority}
              status={task.status}
              progress={task.progress}
              createdAt={task.createdAt}
              dueDate={task.dueDate}
              todoChecklist={task.todoChecklist}
              assignedTo={task.assignedTo.map((user) => user.image)}
              attachmentCount={task.attachments?.length || 0}
              completedTodoCount={task.completedTodoCount}
              onClick={() => handleClick(task._id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserTasks;
