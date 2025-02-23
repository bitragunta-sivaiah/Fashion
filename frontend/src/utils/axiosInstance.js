import axios from 'axios';

const getToken = () => localStorage.getItem('userToken');

const axiosInstance = axios.create({
  baseURL:  `${import.meta.env.VITE_BACKEND_URL}/api`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
