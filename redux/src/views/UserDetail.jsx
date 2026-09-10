import React from "react";
import { UserAPI } from "./utils";

export default class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: {} };
  }
  componentDidMount() {
    let user = this.props.location.state;
    if (!user) {
      let id = this.props.match.params.id;
      user = UserAPI.find(id);
    }
    if (user) {
      this.setState({ user });
    }
  }
  render() {
    const { user } = this.state;
    return (
      <div>
        <p>Id:{user.id}</p>
        <p>用户名:{user.username}</p>
      </div>
    );
  }
}
