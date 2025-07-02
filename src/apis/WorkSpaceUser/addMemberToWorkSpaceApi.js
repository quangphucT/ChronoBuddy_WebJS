import api from "../../config/api"

export const addMemberApi = async( workSpaceId,values) =>{
    const response = await api.post(`workspace/${workSpaceId}/members`,values)
    return response;
}