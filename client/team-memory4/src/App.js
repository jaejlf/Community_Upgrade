import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import {
  Home,
  Signup,
  Login,
  Logout,
  PostDetail,
  PostList,
  PostWrite,
  NotFound,
} from "./pages";
import {
  useReducer,
  createContext,
  useContext,
  useEffect,
} from "react";

const Header = () => {
  return (
    <div>
      메뉴구성
    </div>
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
      };
    case "logout":
      return {
        token: null,
        email: null,
        role: null,
        name: null,
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
            const { token, email, role, name } = loggedInfo;
            await dispatch({
                type: "login",
                token: token,
                email: email,
                role: role,
                name: name,
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
          <Route path="/" exact={true} element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/postdetail' element={<PostDetail />} />
          <Route path='/postlist' element={<PostList />} />
          <Route path='/write' element={<PostWrite />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
