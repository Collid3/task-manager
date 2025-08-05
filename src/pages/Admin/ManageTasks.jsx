import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/TaskCard";

const ManageTasks = () => {
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

  const handleClick = (taskData) => {
    navigate("/admin/create-task", { state: { taskId: taskData._id } });
  };

  const handleDownloadReport = async () => {
    try {
      const { data } = await api.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "tasks_report.xlsx");
      document.body.appendChild(link);

      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Error downloading tasks report " + error);
      toast.error("Failed to download tasks report. Please try again");
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-medium md:text-xl">My Tasks</h2>

            <button
              className="flex lg:hidden download-btn"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>

          {tabs[0]?.count > 0 && (
            <div className="lg:flex items-center">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              <button
                className="hidden lg:flex download-btn"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            </div>
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
              onClick={() => handleClick(task)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
