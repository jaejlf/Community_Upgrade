import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { LoginForm } from '../components';
import {ReactComponent as Logo} from '../assets/images/Logo.svg';
import '../styles/Login.css';

const Login = () => {
    const [userRole, setUserRole] = useState("일반회원");
    const [roleid, setRoleid] = useState(0);  // 0: 일반회원, 1: 기업회원

    const roleClickHandler = async (id) => {
        setRoleid(id);
        if (id === 0) {
            setUserRole("일반회원");
        } else {
            setUserRole("기업회원");
        }
    }

    return (
        <div>
            <Logo className="login-logo"/>
            <p className='login-role-ment'>
                {userRole}으로 로그인합니다.
            </p>
            <div className='login-roles'>
                <button
                    // className='login-role-select'
                    className={
                        roleid === 0 ? 
                        'login-role-select-o' : 'login-role-select-x'
                    }
                    onClick={() => roleClickHandler(0)}>
                    <input
                        id="일반"
                        type="radio"
                        name="role-selector"
                    />일반회원
                </button>
                <button
                    // className='login-role-select'
                    className={
                        roleid === 1 ? 
                        'login-role-select-o' : 'login-role-select-x'
                    }
                    onClick={() => roleClickHandler(1)}>
                    <input
                        id="기업"
                        type="radio"
                        name="role-selector"
                    />기업회원
                </button>
            </div>
            <LoginForm roleid={roleid}/>
            <p className='login-goto-signup'>레디미 커뮤니티가 처음이신가요?&nbsp;
                <Link to={`/signup/${roleid}`}>
                    회원가입
                </Link>
            </p>
        </div>
    );
};

export default Login;