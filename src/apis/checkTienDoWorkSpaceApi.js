import api from "../config/api";
export const checkTienDo = async (id) => {
  const response = await api. get(`workspace/progress/workspace/${id}`);
  return response;
};
