import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const isSessionCheck = error.config?.url?.includes("/api/auth/me");

    if (error.response?.status === 401 && !isSessionCheck) {
      localStorage.removeItem("isLogin");
      localStorage.removeItem("userInfo");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;