import api from "../config/api"

export const getDuAnChuaXong = async(user_id) =>{
    const response = await api.get(`workspace/progress/user/${user_id}`)
    return response;
}