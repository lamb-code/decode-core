import { createRoot } from "react-dom/client";
import {
  HashRouter,
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "./react-router-v6";

import Home from "./views/v6/Home";
import User from "./views/v6/User";
import Profile from "./views/v6/Profile";
import UserAdd from "./views/v6/UserAdd";
import Post from "./views/v6/Post";
import UserList from "./views/v6/UserList";
import UserDetail from "./views/v6/UserDetail";

const root = createRoot(document.getElementById("root"));
function render() {
  root.render(
    <BrowserRouter>
      <ul>
        <li>
          <Link to="/">首页</Link>
        </li>
        <li>
          <Link to="/user">用户管理</Link>
        </li>
        <li>
          <Link to="/profile">个人中心</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/user" element={<User />}>
          <Route path="add" element={<UserAdd/>}></Route>
          <Route path="list" element={<UserList/>}></Route>
          <Route path="detail/:id" element={<UserDetail/>}></Route>

        </Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/post/:id" element={<Post />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
render();
