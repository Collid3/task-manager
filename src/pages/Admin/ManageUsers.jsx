import React from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/UserCard";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const { data } = await api.get(API_PATHS.USERS.GET_ALL_USERS);
      if (data.users.length > 0) {
        setAllUsers(data.users);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const { data } = await api.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "users_report.xlsx");
      document.body.appendChild(link);

      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Error downloading users report " + error);
      toast.error("Failed to download users report. Please try again");
    }
  };

  useEffect(() => {
    getAllUsers();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex lg:items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="flex items-center">Team Members</h2>

          <button className="flex download-btn" onClick={handleDownloadReport}>
            <LuFileSpreadsheet className="text-lg" /> Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers.map((user) => (
            <UserCard key={user._id} userInfo={user} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
