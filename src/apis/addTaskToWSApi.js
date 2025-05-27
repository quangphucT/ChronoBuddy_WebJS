import api from "../config/api"

export const addTaskToWS = async(values, workspaceId) => {
    const response = await api.post(`task/workspace/${workspaceId}`,values);
    return response;
}