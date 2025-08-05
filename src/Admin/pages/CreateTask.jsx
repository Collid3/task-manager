import React, { useEffect } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import { useState } from "react";
import { PRIORITY_DATA } from "../../utils/data";
import SelectDropDown from "../components/Create-Task/SelectDropDown";
import SelectUsers from "../components/Create-Task/SelectUsers";
import TodoListInput from "../components/Create-Task/TodoListInput";
import AddAttachmentsInput from "../components/Create-Task/AddAttachmentsInput";
import api from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import Modal from "../components/Create-Task/Modal";
import DeleteAlert from "../components/DeleteAlert";

const CreateTask = () => {
  useUserAuth();

  const [currentTask, setCurrentTask] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const navigate = useNavigate();
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
    setLoading("Creating task...");

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
      setLoading(null);
    }
  };

  const updateTask = async () => {
    setLoading("Updating task...");

    try {
      const todoList = taskData.todoChecklist?.map((todo) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find(
          (task) => task.text === todo
        );

        return {
          text: todo,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const { data } = await api.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString,
        todoChecklist: todoList,
      });

      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(null);
    }
  };

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

  const getTaskDetailsByID = async () => {
    try {
      const { data } = await api.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      const task = data.task;
      setCurrentTask(task);

      setTaskData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate
          ? moment(task.dueDate).format("YYYY-MM-DD")
          : null,
        assignedTo: task?.assignedTo?.map((user) => user._id) || [],
        todoChecklist: task?.todoChecklist?.map((todo) => todo.text) || [],
        attachments: task?.attachments || [],
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async () => {
    setLoading("Deleting task...");

    try {
      const { data } = await api.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      toast.success(data.message);
      navigate("/admin/tasks");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID();
    } else clearData();

    return () => {};
  }, [taskId]);

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
                  <LuTrash2
                    onClick={() => setOpenDeleteAlert(true)}
                    className="text-base"
                  />{" "}
                  Delete
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
              {loading ? loading : taskId ? "UPDATE TASK" : "CREATE TASK"}
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={deleteTask}
          loading={loading}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
