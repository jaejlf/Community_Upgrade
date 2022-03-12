import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import {
  Home,
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
} from "react";
import { ReactComponent as Logo } from './assets/images/Logo.svg';


const Header = () => {
  const authContext = useContext(AuthContext);
  // if (window.location.pathname === "/login" ||
  //   window.location.pathname === "/signup") {
  //   return null;
  // }
  
  return (
    <header className="App-header">
      <div className="header-links">
        {!authContext.state.token ? (
          <>
            <Logo width={100} height={60}/>
            <div>
              <Link to="/login" className="my-page-plain">
                로그인
              </Link>
            </div>
          </>
        ) : (
          <>
            <Logo width={60} height={60} />
            <div>
              <Link to="/logout" className='my-page-plain' >Logout</Link>
            </div>
          </>
        )}
      </div>
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

  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("loggedInfo")));

    const initUserInfo = async () => {
        const loggedInfo = await JSON.parse(
            localStorage.getItem("loggedInfo")
        );
        console.log("-------------새로 고침------------");
        console.log(loggedInfo);

        if (loggedInfo) {
            const { token, email, role, name, userId } = loggedInfo;
            await dispatch({
                type: "login",
                token: token,
                email: email,
                role: role,
                name: name,
                userId: userId,
            });
        } else {
            await dispatch({
                type: "logout",
            });
        }
    };
    initUserInfo();
  }, [state.token]);

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
          <Route path='*' element={<NotFound />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
