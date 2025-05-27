import api from "../config/api";

export const getWorkSpaceUser = async (user_id) => {
  const response = await api.get(`workspace/user/${user_id}`);
  return response;
};
