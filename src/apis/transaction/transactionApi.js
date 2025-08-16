import api from "../../config/api";

export const getTransaction = async() =>{
    const response = await api.get("payment/history")
    return response;
}

// Get transaction statistics for dashboard
export const getTransactionStats = async() => {
    try {
        const response = await api.get("payment/history");
        return response.data;
    } catch (error) {
        console.error("Error fetching transaction stats:", error);
        throw error;
    }
}