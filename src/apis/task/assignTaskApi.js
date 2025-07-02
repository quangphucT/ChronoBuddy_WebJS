import api from "../../config/api"

export const assignTask = async(task_id, user_id) =>{
    const response = await api.post(`task-assignees/${task_id}/assign/${user_id}`);
    return response;
}