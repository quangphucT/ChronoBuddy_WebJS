import api from "../../config/api"

export const updateWorkSpaceUser = async(workSpaceId) =>{
    const response = await api.put(`workspace/${workSpaceId}`)
    return response;
}