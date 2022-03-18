import React, { useContext, useEffect } from "react";
import { AuthContext } from "../App";
import { getApi } from "../api";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Logout = () => {
  const authContext = useContext(AuthContext);
  const [cookies, setCookie, removeCookie] = useCookies(["myToken"]);

  const navigate = useNavigate();

  useEffect(() => {
    const getLogout = async () => {
      await getApi({}, "/user/logout")
        .then(({ status, data }) => {
          // console.log("status:", status);
          if (status === 200 || status === 201 || status === 204) {
            navigate("/");
            authContext.dispatch({
              type: "logout",
              token: null,
              email: null,
              name: null,
              role: null,
            });
            alert("로그아웃 되었습니다.");
            removeCookie("myToken");
          } else {
            alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    getLogout();
  }, [authContext, navigate]);

  return <div>Logout</div>;
};

export default Logout;
