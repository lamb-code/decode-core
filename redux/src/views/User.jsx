import React from "react";
import { Link ,Route} from "../react-router-v4";
import UserList from "./UserList";
import UserAdd from "./UserAdd";
import UserDetail from "./UserDetail";
// export default function () {
//   return <div>User</div>;
// }

export default class User extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/user/list">用户列表</Link>
          </li>
          <li>
            <Link to="/user/add">添加用户</Link>
          </li>
        </ul>
        <div>
          <Route path="/user/list" component={UserList}></Route>
          <Route path="/user/add" component={UserAdd}></Route>
          <Route path="/user/detail/:id" component={UserDetail}></Route>
        </div>
      </div>
    );
  }
}
