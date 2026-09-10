import React from "react";
import { UserAPI } from "./utils";
import { Link } from "../react-router-v4";
export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { users: [] };
  }
  componentDidMount(){
    let users = UserAPI.list()
    this.setState({users})
  }
  render() {
    return (
      <ul>
        {this.state.users.map((user, index) => {
          return (
            <li key={user.id}>
              <Link to={{ pathname: `/user/detail/${user.id}`, state: user }}>
                {user.username}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }
}
