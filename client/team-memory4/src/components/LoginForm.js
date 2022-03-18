import React, { useState, useContext, useEffect } from "react";
import { postApi } from "../api";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useCookies } from "react-cookie";

//로그인
// - 성공 : email, password가 일치하면 성공(200)
// - 실패 : 필수 입력값이 없는 경우 400 (Bad Request)
//         없는 email인 경우 404 (Not Found)
//         password가 틀린경우 500 ( Server Error )
const LoginForm = ({ props }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["myToken"]);
  const [details, setDetails] = useState({
    email: "",
    password: "",
    role: props,
  });
  useEffect(() => {
    setDetails({ ...details, role: props });
  }, [props]);

  const [emailValid, setEmailValid] = useState(); // email 형식 확인
  const [loginErrorMsg, setLoginErrorMsg] = useState("");
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Email 형식 체크
    var regExp =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    setEmailValid(regExp.test(details.email));
  }, [details.email]);

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log(details);
    if (!details.email) {
      setLoginErrorMsg("이메일을 입력해주세요.");
    } else if (!emailValid) {
      setLoginErrorMsg("이메일 형식에 맞게 입력해주세요.");
    } else {
      await postApi(details, "/user/login")
        .then(({ status, data }) => {
          if (status === 200) {
            // console.log(data);
            // console.log(data.token);
            setLoginErrorMsg("");
            authContext.dispatch({
              type: "login",
              token: data.token,
              email: details.email,
              role: data.role,
              name: data.name,
              userId: data.userId,
            });
            setCookie("myToken", data.token, { path: "/" });
            navigate("/");
          } else if (status === 400) {
            setLoginErrorMsg("필수 입력값을 모두 입력해주세요.");
          } else if (status === 404) {
            setLoginErrorMsg("존재하지 않는 이메일입니다.");
          } else {
            setLoginErrorMsg("로그인 실패");
          }
        })
        .catch((e) => {
          setLoginErrorMsg("로그인 실패");
          console.log(e.response);
        });
      //////////////////////////////////////////////////
    }
  };
  return (
    <form className="Login-outer-form" onSubmit={submitHandler}>
      <div className="form-group">
        <div className="form-item">
          <input
            type="text"
            name="email"
            placeholder="EMAIL"
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
            value={details.email}
          />
        </div>
      </div>
      <div className="form-group">
        <div className="form-item">
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            onChange={(e) =>
              setDetails({ ...details, password: e.target.value })
            }
            value={details.password}
          />
        </div>
      </div>
      <p>{loginErrorMsg}</p>
      <br></br>
      <button className="Login-button" type="submit">
        로그인
      </button>
      <br />
    </form>
  );
};

export default LoginForm;
