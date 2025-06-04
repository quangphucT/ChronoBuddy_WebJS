import api from "../config/api"

export const getDetailsPackagePro = async(id) =>{
    const response = await api.get(`subscription-plans/${id}`)
    return response;
}