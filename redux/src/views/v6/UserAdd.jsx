import React from "react";
import { UserAPI } from "../utils";
import { useNavigate } from "../../react-router-v6";
export default function UserAdd() {
  const ref = React.useRef();
  const navigate = useNavigate();
  submit = (event) => {
    event.preventDefault();
    let username = this.ref.current.value;
    UserAPI.add({ id: Date.now() + "", username });
    navigate("/user/list");
  };
  return (
    <form onSubmit={submit}>
      <input type="text" ref={ref}></input>
      <button type="submit">提交</button>
    </form>
  );
}
