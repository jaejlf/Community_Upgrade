import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import { 
  Home,
  Signup, 
  Login, 
  PostDetail,
  PostList,
  PostWrite,
  NotFound,
} from "./pages";

const Header = () => {
  return (
    <div>
      메뉴구성
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <Header />
          <Routes>
            <Route path="/" exact={true} element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/postdetail' element={<PostDetail />} />
            <Route path='/postlist' element={<PostList />} />
            <Route path='/write' element={<PostWrite />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
    </div>
  );
}

export default App;
