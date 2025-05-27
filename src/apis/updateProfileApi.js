import api from "../config/api";
export const updateProfile = async (values, user_id) => {
  const response = await api.put(`user/${user_id}`, values);
  return response;
};
