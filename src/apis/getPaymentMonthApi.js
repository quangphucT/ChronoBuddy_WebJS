import api from "../config/api"

export const getPaymentMonth = async (year,month) => {
    const response = await api.get(`payment/month`, {
        params: { year,month } // axios sẽ tự động thêm ?year=2025
    });
    return response;
};
