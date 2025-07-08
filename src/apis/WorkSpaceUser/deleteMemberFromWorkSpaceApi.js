import api from "../../config/api"

export const deleteMemberFromWorkSpaceApi = async(workspaceId, userId) => {
     const response = await api.delete(`workspace/${workspaceId}/members/${userId}`);
     return response;
}