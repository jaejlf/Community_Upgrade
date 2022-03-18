import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/images/Logo.svg";
import { ReactComponent as HeaderLine } from "../assets/images/header-line.svg";
import { useCookies } from "react-cookie";

const Header = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["myToken"]);

  return (
    <header className="App-header">
      <div className="header-links">
        {!cookies.myToken ? (
          <>
            <Link to="/">
              <Logo width={100} height={60} />
            </Link>
            <Link to="/login">
              <button className="header-btn">로그인</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/">
              <Logo width={100} height={60} />
            </Link>
            <div className="header-right">
              <Link to="/write">
                <button className="header-btn">글쓰기</button>
              </Link>
              <Link to="/mypage">
                <button className="header-btn" id="header-black-btn">
                  마이페이지
                </button>
              </Link>
              <Link to="/logout">
                <button className="header-btn">로그아웃</button>
              </Link>
            </div>
          </>
        )}
      </div>
      <HeaderLine />
    </header>
  );
};

export default Header;
