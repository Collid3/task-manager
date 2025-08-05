import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import toast from "react-hot-toast";
import api from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

import emptyAvatar from "../../assets/images/Empty-avatar.png";
import moment from "moment";
import AvatarGroup from "../../components/Create-Task/AvatarGroup";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

const TaskDetails = () => {
  const [task, setTask] = useState(null);

  const { taskId } = useParams();

  const getStatusTagColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/10";
    }
  };

  const getTaskDetails = async () => {
    try {
      const { data } = await api.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      setTask(data.task);
    } catch (error) {
      console.log("Error fetching task. " + error);

      toast.error("Failed to fetch task. Please try again");
    }
  };

  const updateTodoChecklist = async (index) => {
    const todoChecklist = task.todoChecklist;

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;
    }

    try {
      const { data } = await api.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
        { todoChecklist }
      );

      setTask(data.updatedTask);
    } catch (error) {
      console.log("Failed to update Todo checklist " + error);

      toast.error("Failed to update Todo checklist. Please try again.");
    }
  };

  const handleClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link;
    }

    window.open(link, "_blank");
  };

  useEffect(() => {
    if (taskId) getTaskDetails();

    return () => {};
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base md:text-xl font-medium ">
                  {task?.title}
                </h2>

                <div
                  className={`text-[11px] font-medium ${getStatusTagColor(
                    task?.status
                  )} px-4 py-0.5 rounded`}
                >
                  {task?.status}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox label="Description" value={task?.description} />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="priority" value={task?.priority} />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={
                      task?.dueDate
                        ? moment(task?.dueDate).format("Do MM YYYY")
                        : "N/A"
                    }
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">
                    Assigned To
                  </label>

                  <AvatarGroup
                    avatars={task?.assignedTo.map((user) =>
                      user?.image?.trim() ? user.image : emptyAvatar
                    )}
                    maxVisible={5}
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="text-xs font-medium text-slate-500">
                  Todo Checklist
                </label>

                {task?.todoChecklist.map((todo, index) => (
                  <TodoChecklist
                    key={`todo: ${index}`}
                    text={todo?.text}
                    isChecked={todo?.completed}
                    onChange={() => updateTodoChecklist(index)}
                  />
                ))}
              </div>

              {task?.attachments?.length > 0 && (
                <div className="mt-2">
                  <label className="text-xs font-medium text-slate-500">
                    Attachments
                  </label>

                  {task?.attachments?.map((link, index) => (
                    <Attachment
                      key={`link ${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleClick(link)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TaskDetails;

const InfoBox = ({ value, label }) => {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">{label}</label>

      <p className="text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5">
        {value}
      </p>
    </>
  );
};

const TodoChecklist = ({ text, isChecked, onChange }) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
      />

      <p className="text-[13px] text-gray-800">{text}</p>
    </div>
  );
};

const Attachment = ({ link, index, onClick }) => {
  return (
    <div
      className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-1 flex items-center gap-3">
        <span className="text-xs text-gray-400 font-semibold mr-2">
          {index < 9 ? `0${index + 1}` : index}
        </span>

        <p className="text-xs text-black">{link}</p>
      </div>

      <LuSquareArrowOutUpRight className="text-gray-400" />
    </div>
  );
};
