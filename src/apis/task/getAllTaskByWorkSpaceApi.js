import api from "../../config/api";
export const getAllTaskByWorkSpaceId= async (workSpace_id) => {
  const response = await api.get(`task/workspace/${workSpace_id}`);
  return response;
};
