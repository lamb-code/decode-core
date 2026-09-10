import React from "react";
import { UserAPI } from "../utils";
export default function UserList() {
  let [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    let users = UserAPI.list();
    setUsers(users);
  });
  return (
    <ul>
      {users.map((user, index) => {
        return (
          <li key={user.id}>
            <Link to={`/user/detail/${user.id}`}>
              {user.username}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
