export const BASE_URL = "http://localhost:4000/api";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    PROFILE: "/auth/profile",
  },

  USERS: {
    GET_ALL_USERS: "/users",
    GET_USER_BY_ID: (userId) => `/users/${userId}`,
    UPDATE_USER: "/auth/profile",
    DELETE_USER: "/users",
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/tasks/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/tasks/user-dashboard-data",
    GET_ALL_TASKS: "/tasks",
    GET_TASK_BY_ID: (taskId) => `/tasks/${taskId}`,
    CREATE_TASK: "/tasks",
    UPDATE_TASK: (taskId) => `/tasks/${taskId}`,
    DELETE_TASK: (taskId) => `/tasks/${taskId}`,

    UPDATE_TASK_STATUS: (taskId) => `/tasks/status/${taskId}`,
    UPDATE_TODO_CHECKLIST: (taskId) => `/tasks/todo/${taskId}`,
  },

  REPORTS: {
    EXPORT_TASKS: "reports/tasks",
    EXPORT_USERS: "reports/users",
  },
};
