import api from "../config/api"

export const deletePackagePro = async(id) =>{
    const response = await api.delete(`subscription-plans/${id}`)
    return response
}