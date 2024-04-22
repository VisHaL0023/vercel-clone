import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = "http://localhost:9000/api/v1/";
// axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.timeout = "60000";

export default axiosInstance;
