import api from "../config/api";

export const getRevenueEachPackageYear = async(subcription_plans_id,year) =>{
     const response = await api.get(`payment/revenue/${subcription_plans_id}/year`, {
        params: { year } // axios sẽ tự động thêm ?year=2025
    });
    return response;
}