import axios from "axios";

const api = axios.create({
  baseURL: "https://exe201-client.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
  withCredentials: true, // Bật nếu cần gửi cookie/JWT
  //... other axios options
});
// Trước khi gọi API, thêm token vào headers
api.interceptors.request.use(function (config) {
  // Do something before request is sent
  const token = localStorage.getItem("token")
  if(token){
      config.headers.Authorization = `Bearer ${token}`
  }
  
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Interceptor cho response để xử lý lỗi tập trung
api.interceptors.response.use(
  function (response) {
    // Response thành công (status 2xx)
    console.log("API Response:", response.config.url, response.status, response.data);
    return response;
  },
  function (error) {
    // Response lỗi (status khác 2xx)
    console.error("API Error:", error.config?.url, error.response?.status, error.response?.data);
    
    // Xử lý các trường hợp lỗi đặc biệt
    if (error.response?.status === 401) {
      // Unauthorized - có thể token expired
      console.warn("Unauthorized access - token may be expired");
      // Có thể redirect về login page ở đây
    }
    
    return Promise.reject(error);
  }
);

export default api;


