import api from "../../config/api"

export const countWorkSpaceUnCompleted = async(userId) =>{
    const response = await api.get(`workspace/users/${userId}/workspaces/uncompleted-count`)
    return response;
}