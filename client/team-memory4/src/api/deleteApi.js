import axios from "axios";
import { getCookie } from "./cookie";

const deleteApi = async (params, end_url, token) => {
    const config = {
        data: params,
        headers: {
            "Content-type": "application/json",
            Accept: "application/json",
        },
    };
    if (token) {
        // config.headers["Authorization"] = `Bearer ${token}`;
        config.headers["Authorization"] = `Bearer ${getCookie('myToken')}`;
    }
    return await axios.delete(process.env.REACT_APP_BACK_BASE_URL + end_url, config);
};

export default deleteApi;
