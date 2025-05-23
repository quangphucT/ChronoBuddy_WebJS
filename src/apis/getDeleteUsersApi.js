import api from "../config/api"

export const getUsersDelete =async() =>{
    const response = await api.get("user/deleted");
    return response;
}