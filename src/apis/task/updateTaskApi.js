import api from "../../config/api"

export const updateTask = async(values, task_id) =>{
    const response = await api.put(`task/${task_id}`, values);
    return response;
}