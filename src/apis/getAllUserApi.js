import api from "../config/api"

export const getAllUser = async() =>{
   const res = await api.get("user/get/all")
   return res.data.data
}