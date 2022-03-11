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
        config.headers["Authorization"] = `Bearer ${getCookie('myToken')}`;
    }
    return await axios.put("https://kusitms-readyme-4.herokuapp.com" + end_url, data, config);
};

export default putApi;
