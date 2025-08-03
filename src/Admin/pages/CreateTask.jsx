import React from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserContext } from "../../context/UserContext";
import { useLocation } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import { useState } from "react";
import { PRIORITY_DATA } from "../../utils/data";
import SelectDropDown from "../components/SelectDropDown";
import SelectUsers from "../components/SelectUsers";
import TodoListInput from "../components/TodoListInput";
import AddAttachmentsInput from "../components/AddAttachmentsInput";
import api from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateTask = () => {
  useUserAuth();

  const { me, navigate } = useUserContext();

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const location = useLocation();
  const { taskId } = location.state || {};

  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const createTask = async () => {
    setLoading(true);

    try {
      const todoList = taskData.todoChecklist.map((todo) => ({
        text: todo,
        completed: false,
      }));

      const { data } = await api.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });

      toast.success(data.message);

      clearData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {};

  const handleSubmit = async () => {
    // input validation
    if (!taskData.title.trim()) {
      return toast.error("Title is required");
    }
    if (!taskData.description.trim()) {
      return toast.error("Description is required");
    }
    if (!taskData.dueDate) {
      return toast.error("Due date is required");
    }
    if (taskData.assignedTo.length === 0) {
      return toast.error("Task not assigned to any member");
    }
    if (taskData.todoChecklist.length === 0) {
      return toast.error("Add atleast one todo task");
    }

    if (taskId) {
      updateTask();
      return;
    }

    createTask();
  };

  const getTaskDetailsByID = async () => {};

  const deleteTask = async () => {};

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2>{taskId ? "Update Task" : "Create Task"}</h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>

              <input
                className="form-input"
                type="text"
                placeholder="Create App UI"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Task Description
              </label>

              <input
                className="form-input"
                type="text"
                rows={4}
                placeholder="Describe task"
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>

                <SelectDropDown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>

                <input
                  className="form-input"
                  type="date"
                  placeholder="Select date"
                  value={taskData.dueDate}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>

                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) =>
                    handleValueChange("assignedTo", value)
                  }
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font font-medium text-slate-600">
                TODO Checklist
              </label>

              <TodoListInput
                todoList={taskData.todoChecklist}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="">Add Attachments</label>

              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            <button className="add-btn outline-none" onClick={handleSubmit}>
              {taskId ? "UPDATE TASK" : "CREATE TASK"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
