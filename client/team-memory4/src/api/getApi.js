import axios from "axios";
import { getCookie } from "./cookie";

const getApi = async (params, end_url, token) => {
    const config = {
        params: params,
        headers: {
            "Content-type": "application/json",
            Accept: "application/json",
        },
    };
    if (token) {
        // config.headers["Authorization"] = `Bearer ${token}`;
        config.headers["Authorization"] = `Bearer ${getCookie('myToken')}`;
    }
    return await axios.get("https://kusitms-readyme-4.herokuapp.com" + end_url, config);
};

export default getApi;
