import api from "../config/api"

export const getAllMemberOnWorkSpaceApi = async(workSpaceId) =>{
    const response = await api.get(`workspace/${workSpaceId}/members`)
    return response;
}