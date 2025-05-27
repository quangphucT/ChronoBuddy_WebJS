import api from "../config/api";
export const addWorkSpace = async (values, user_id) => {
  const response = await api.post(`workspace/user/${user_id}`, values);
  return response;
};
