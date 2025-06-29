import api from "../../config/api"

export const getAllWorkSpaceUser = async(userId) =>{
    const response = await api.get(`workspace/user/${userId}`)
    return response;
}