import api from "../config/api";
export const getAllTaskDoneByUserID = async (user_id) => {
  const response = await api.get(`task/users/${user_id}/completed-count`);
  return response;
};
