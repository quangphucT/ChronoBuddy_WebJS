import api from "../config/api"

export const addNewPackagePro = async(values) =>{
    const response = await api.post("subscription-plans/create", values)
    return response;
}