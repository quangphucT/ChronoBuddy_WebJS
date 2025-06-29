import api from "../../config/api"

export const getAllTaskByUserId = async(userId) =>{
    const response = await api.get(`task/user/${userId}`)
    return response;
}