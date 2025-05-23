import api from "../config/api";
export const restoreAccount = async (id) => {
  const response = await api.put(`user/restore/${id}`);
  return response;
};
