import api from "../config/api"
export const getPaymentUserHistory = async(userId) =>{
    const response = await api.get(`payment/history/${userId}`)
    return response;
}