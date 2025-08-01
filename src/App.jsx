import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import PrivateRoute from "./routes/PrivateRoute";

import Dashboard from "./Admin/pages/Dashboard";
import ManageTasks from "./Admin/pages/ManageTasks";
import CreateTask from "./Admin/pages/CreateTask";
import ManageUsers from "./Admin/pages/ManageUsers";

import UserDashboard from "./Admin/User/UserDashboard";
import UserTasks from "./Admin/User/UserTasks";
import UserTask from "./Admin/User/UserTask";
import { Toaster } from "react-hot-toast";
import { useUserContext } from "./context/UserContext";

function App() {
  return (
    <div className="">
      <Toaster />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={<PrivateRoute allowedRoles={["admin"]} />}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<ManageTasks />} />
          <Route path="create-task" element={<CreateTask />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        {/* User Routes */}
        <Route path="/user" element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="tasks" element={<UserTasks />} />
          <Route path="tasks/:taskId" element={<UserTask />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Root />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

const Root = () => {
  const { me, loading } = useUserContext();

  if (loading) return <Outlet />;

  if (!me) {
    return <Navigate to="login" />;
  }

  return me.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};
