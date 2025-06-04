import api from "../config/api"

export const saveDataToDB = async(values) =>{
    const response = await api.post("payment/callback",values)
    return response;
}