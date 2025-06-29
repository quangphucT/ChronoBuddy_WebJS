import api from "../../config/api"

export const deleteTask = async(task_id) =>{
    console.log("Calling delete API with task_id:", task_id);
    console.log("Delete endpoint:", `task/${task_id}`);
    const response = await api.delete(`task/${task_id}`);
    console.log("Delete API response:", response);
    return response;
}