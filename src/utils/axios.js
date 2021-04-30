import Axios from "axios";

const axiosInstance = Axios.create({
    baseURL: "http://localhost:2000/",
    timeout: 3000,
});

export default axiosInstance