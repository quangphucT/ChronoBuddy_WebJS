import api from "../../config/api"

export const getTop5TaskUnCompleted = async(userId) =>{
    const response = await api.get(`task/users/${userId}/tasks/top5`)
    return response;
}