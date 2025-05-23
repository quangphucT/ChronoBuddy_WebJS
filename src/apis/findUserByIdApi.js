import api from "../config/api";

export const findUserById = async (id) => {
  const response = await api.get(`user/get/${id}`);
  return response;
};
