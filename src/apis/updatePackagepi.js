import api from "../config/api"

export const updatePackagePro = async(id, values) =>{
    const response = await api.put(`subscription-plans/${id}`,values)
    return response;
}