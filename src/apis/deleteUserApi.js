import api from "../config/api"
export const deleteUser = async(id) =>{
   const response =  await api.delete(`user/delete/${id}`);
   return response.data
}