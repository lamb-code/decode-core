import React from "react";
import { useLocation } from "../../react-router-v6";
export default function UserDetail() {
  let [user, setUser] = React.useState({});
  const location = useLocation();
  React.useEffect(() => {
    let user = location.state;
    if (user) {
      setUser(user);
    }
  }, []);
  return (
    <div>
      <p>Id:{user.id}</p>
      <p>用户名:{user.username}</p>
    </div>
  );
}
