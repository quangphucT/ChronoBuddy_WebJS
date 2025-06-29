import api from "../config/api";

export const getTop5TaskInProcess = async (user_id) => {
  const response = await api.get(`task/users/${user_id}/tasks/top5`);
  return response;
};
