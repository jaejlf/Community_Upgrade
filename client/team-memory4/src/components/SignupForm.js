import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//회원가입
// - 성공 : 201 응답 (Created), 생성된 User객체 반환
// - 실패 :필수 입력값이 누락 시 400 리턴 (Bad Request)
//        email이 중복된 경우 409 리턴 (Conflict)
const SignupForm = (roleid) => {
    console.log(roleid);

    const [details, setDetails] = useState({
        email: "",
        password: "",
        name: "",
        role: roleid,
    });
    
    const [emailValid, setEmailValid] = useState();  // email 형식 확인
    const [checkMsg, setCheckMsg] = useState("");

    const navigate = useNavigate();

    useEffect(() => {  // Email 형식 체크
        var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        setEmailValid(regExp.test(details.email));
        // console.log(emailValid);
    }, [details.email]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!emailValid) {
            setCheckMsg("이메일 형식에 맞게 입력해주세요.");
        } else {
            setCheckMsg("");
            await axios.post(
                "http://localhost:5000/user/signup",
                details,
                {
                    headers: {
                        "Content-type": "application/json",
                        Accept: "application/json",
                    },
                }
            ).then(({ status, data }) => {
                if (status === 201 || status === 200) {
                    setCheckMsg("");
                } else if (status === 409) {
                    setCheckMsg("중복된 이메일입니다.");
                } else if (status === 400) {
                    setCheckMsg("모든 입력값을 입력해주세요.");
                }
                navigate("/login"); // 회원가입 성공 시 로그인창으로 이동
            })
            .catch((e) => {
                console.log(e);
            })
        }
    }

    return (
        <form className="Signup-outer-form" onSubmit={submitHandler}>
            <div className="form-group">
                <div className="form-group">
                    <div className="form-item">
                        <input
                            type="text"
                            name="email"
                            placeholder="EMAIL"
                            onChange={(e) =>
                                setDetails({ ...details, email: e.target.value })
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="form-group">
                <div className="form-item">
                    <input
                        type="text"
                        name="name"
                        placeholder="NAME"
                        onChange={(e) =>
                            setDetails({ ...details, name: e.target.value })
                        }
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
                    />
                </div>
            </div>
            <p>{checkMsg}</p>
            <br />
            <button 
                className="Login-button"
                type="submit"
            >회원가입</button>
        </form>
    );
};

export default SignupForm;