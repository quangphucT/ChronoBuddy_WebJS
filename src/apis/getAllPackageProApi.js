import api from "../config/api";
export const getAllPackagesPro = async() =>{
    const response = await api.get('subscription-plans')
    return response;
}