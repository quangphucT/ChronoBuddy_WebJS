import api from "../../config/api"

export const addTaskToWS = async(payload, workspaceId) => {
    const response = await api.post(`task/workspace/${workspaceId}`,payload);
    return response;
}