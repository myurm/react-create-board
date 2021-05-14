import Axios from "axios";

const axiosInstance = Axios.create({
    baseURL: "http://192.168.0.16:2000/",
    timeout: 3000,
});

export default axiosInstance