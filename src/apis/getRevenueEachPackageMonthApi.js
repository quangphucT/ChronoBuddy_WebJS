import api from "../config/api";
export const getRevenueEachPackageMonth = async(subcription_plans_id,month, year) =>{
     const response = await api.get(`payment/revenue/${subcription_plans_id}/month`, {
        params: { month, year } // axios sẽ tự động thêm ?year=2025
    });
    return response;
}