import api from "../config/api";

export const deleteWorkSpace = async (workspace_id) => {
  const response = await api.delete(`workspace/${workspace_id}`);
  return response;
};
