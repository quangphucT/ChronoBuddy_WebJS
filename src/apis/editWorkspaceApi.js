import api from "../config/api"
export const editWorkSpace = async(values, workspace_id) =>{
    const response = await api.put(`workspace/${workspace_id}`,values);
    return response;

}