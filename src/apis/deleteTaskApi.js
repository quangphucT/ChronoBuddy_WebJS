import api from "../config/api"

export const deleteTask = async(task_id) =>{
    const response = await api.delete(`task/${task_id}`);
    return response;
}