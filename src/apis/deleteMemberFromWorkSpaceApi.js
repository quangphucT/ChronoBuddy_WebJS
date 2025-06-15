import api from "../config/api"

export const deleteMemberFromWorkSpaceApi = async(workspaceId,userId ) =>{
     await api.delete(`workspace/${workspaceId}/members/${userId}`)
}