import "./App.css";
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
import { ReactComponent as Logo } from "./assets/images/Logo.svg";
import { ReactComponent as HeaderLine } from "./assets/images/header-line.svg";
import { getCookie } from "./api/cookie";
import { Header } from "./components";


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

  return (
    <div className="App">
      <AuthContext.Provider value={{ state, dispatch }}>
        <Header />
        <Routes>
          <Route path="/" exact={true} element={<Board />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/signup/:roleid" element={<Signup />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/modify/:id" element={<PostModify />} />
          <Route path="/write" element={<PostWrite />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
