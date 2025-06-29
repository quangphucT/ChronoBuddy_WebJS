import api from "../config/api"

export const getDuAnDone= async(user_id) =>{
    const response = await api.get(`workspace/user/${user_id}/completed-count`)
    return response;
}