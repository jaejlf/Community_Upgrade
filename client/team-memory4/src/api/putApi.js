import axios from "axios";
import { getCookie } from "./cookie";

const putApi = async (data, end_url, token) => {
    const config = {
        headers: {
            "Content-type": "application/json",
            Accept: "application/json",
        },
    };
    if (token) {
        // config.headers["Authorization"] = `Bearer ${token}`;
        config.headers["Authorization"] = `Bearer ${getCookie('token')}`;
    }
    return await axios.put(process.env.REACT_APP_BACK_BASE_URL + end_url, data, config);
};

export default putApi;
