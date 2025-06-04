import api from "../config/api"

export const paymentCreate = async(values) =>{
    const response = await api.post("payment/create",values)
    return response;
}