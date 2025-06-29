import api from "../../config/api";
export const addNewWorkSpaceByUserId = async (values, user_id) => {
  const response = await api.post(`workspace/user/${user_id}`, values);
  return response;
};
