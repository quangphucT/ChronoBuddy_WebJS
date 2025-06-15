import api from "../config/api"

export const getPaymentYear = async (year) => {
    const response = await api.get(`payment/year`, {
        params: { year } // axios sẽ tự động thêm ?year=2025
    });
    return response;
};
