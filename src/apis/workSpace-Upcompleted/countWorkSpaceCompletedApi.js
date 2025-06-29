import api from "../../config/api"

export const countWorkSpaceCompleted = async(userId) =>{
    const response = await api.get(`workspace/user/${userId}/completed-count`)
    return response;
}