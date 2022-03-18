import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import {
  MyPage,
  Signup,
  Login,
  Logout,
  PostDetail,
  Board,
  PostWrite,
  PostModify,
  NotFound,
} from "./pages";
import {
  useReducer,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ReactComponent as Logo } from './assets/images/Logo.svg';
import { ReactComponent as HeaderLine } from './assets/images/header-line.svg';
import { getCookie } from "./api/cookie";


const Header = () => {
  const [mycookie, setMycookie] = useState();
  useEffect(() => {
    setMycookie(getCookie('myToken'));
  }, []);
  const authContext = useContext(AuthContext);

  return (
    <header className="App-header">
      <div className="header-links">
        {!mycookie ? (
          <>
              <Link to="/"><Logo width={100} height={60} /></Link>
              <Link to="/login">
                <button className="header-btn">로그인</button>
              </Link>
          </>
        ) : (
          <>
            <Link to="/"><Logo width={100} height={60} /></Link>
            <div className='header-right'>
              <Link to="/write">
                <button className="header-btn">글쓰기</button>
              </Link>
              <Link to="/mypage">
                <button className="header-btn" id="header-black-btn">마이페이지</button>
              </Link>
              <Link to="/logout">
                <button className="header-btn">로그아웃</button>
              </Link>
              </div>
          </>
        )}
      </div>
      {/* <div className='header-line'>s</div> */}
      <HeaderLine />
    </header>
  )
}


export const AuthContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        token: action.token,
        email: action.email,
        role: action.role,
        name: action.name,
        userId: action.userId,
      };
    case "logout":
      return {
        token: null,
        email: null,
        role: null,
        name: null,
        userId: null,
      };
    default:
      return state;
  }
};


function App() {
  const [state, dispatch] = useReducer(reducer, {
    token: null,
    email: null,
    role: null,
    name: null,
    userId: null,
  });

  // useEffect(() => {
  //   console.log(JSON.parse(localStorage.getItem("loggedInfo")));

  //   const initUserInfo = async () => {
  //     const loggedInfo = await JSON.parse(
  //       localStorage.getItem("loggedInfo")
  //     );
  //     console.log("-------------새로 고침------------");
  //     console.log(loggedInfo);

  //     if (loggedInfo) {
  //       const { token, email, role, name, userId } = loggedInfo;
  //       await dispatch({
  //         type: "login",
  //         token: token,
  //         email: email,
  //         role: role,
  //         name: name,
  //         userId: userId,
  //       });
  //     } else {
  //       await dispatch({
  //         type: "logout",
  //       });
  //     }
  //   };
  //   initUserInfo();
  // }, [state.token]);

  return (
    <div className="App">
      <AuthContext.Provider value={{ state, dispatch }}>
        <Header />
        <Routes>
          <Route path="/" exact={true} element={<Board />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/signup/:roleid' element={<Signup />} />
          <Route path='/post/:id' element={<PostDetail />} />
          <Route path='/modify/:id' element={<PostModify />} />
          <Route path='/write' element={<PostWrite />} />
          <Route path='/mypage' element={<MyPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
