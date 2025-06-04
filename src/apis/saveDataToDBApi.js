import api from "../config/api"

export const saveDataToDB = async() =>{
    const response = await api.post("payment/callback")
    return response;
}