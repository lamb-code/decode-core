import React from "react";
import { UserAPI } from "./utils";
export default class UserAdd extends React.Component {
  constructor(props) {
    super(props);
  }
  ref = React.createRef();
  submit = (event) => {
    event.preventDefault();
    let username = this.ref.current.value;
    UserAPI.add({ id: Date.now() + "", username });
    this.props.history.push("/user/list");
  };
  render() {
    return (
      <form onSubmit={this.submit}>
        <input type="text" ref={this.ref}></input>
        <button type="submit">提交</button>
      </form>
    );
  }
}
