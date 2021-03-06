import React, { useState, useEffect } from 'react';
import { SignupForm } from '../components';
import {ReactComponent as Logo} from '../assets/images/Logo.svg';
import '../styles/Login.css';


const Signup = () => {
    let url = decodeURI(window.location.href);
    let urlArray = url.split("/");
    let params = urlArray[urlArray.length - 1];
    params *= 1;
    // console.log(params);

    const [userRole, setUserRole] = useState();

    useEffect(() => {
        if (params === 1) {
            setUserRole("일반회원");
        } else {
            setUserRole("기업회원");
        }
    }, [params]);
    
    return (
        <div>
            {/* <Logo className="login-logo"/> */}
            <p className='login-role-ment'>
                {userRole}으로 회원가입합니다.
            </p>
            <SignupForm props={params}/>
        </div>
    );
};

export default Signup;