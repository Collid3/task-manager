import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserContext } from "../../context/UserContext";
import api from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import { addThousandsSeparator } from "../../utils/helper";
import InfoCard from "../components/InfoCard";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../components/TaskListTable";
import CustomPieChart from "../components/PieChart/CustomPieChart";

const COLORS = ["#8D51FF", "#00BBDB", "#7BCE00"];

const Dashboard = () => {
  useUserAuth();

  const { me, navigate } = useUserContext();

  const [dashboardData, setDashboardData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const infoCardData = [
    {
      label: "Total Tasks",
      value: dashboardData?.charts?.taskDistribution?.All,
      color: "bg-primary",
    },
    {
      label: "Pending Tasks",
      value: dashboardData?.charts?.taskDistribution?.Pending,
      color: "bg-violet-500",
    },
    {
      label: "In Progress Tasks",
      value: dashboardData?.charts?.taskDistribution?.InProgress,
      color: "bg-cyan-500",
    },
    {
      label: "Completed Tasks",
      value: dashboardData?.charts?.taskDistribution?.Completed,
      color: "bg-lime-500",
    },
  ];

  const getDashboardData = async () => {
    try {
      const { data } = await api.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      setDashboardData(data.stats);
      prepareChartData(data.stats.charts);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const PriorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(PriorityLevelData);
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">
              Good Morning! {me?.name || ""}
            </h2>

            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do YYYY")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          {infoCardData.map((infoCard, index) => (
            <InfoCard
              key={index}
              label={infoCard.label}
              value={addThousandsSeparator(infoCard.value || 0)}
              color={infoCard.color}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
          <div>
            <div className="card">
              <div className="flex items-center justify-between">
                <h5>Task Distribution</h5>
              </div>

              <CustomPieChart data={pieChartData} colors={COLORS} />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between">
                <h5>Recent Tasks</h5>

                <button className="card-btn" onClick={onSeeMore}>
                  See All <LuArrowRight className="text-base" />
                </button>
              </div>

              <TaskListTable tableData={dashboardData?.recentTasks || []} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
