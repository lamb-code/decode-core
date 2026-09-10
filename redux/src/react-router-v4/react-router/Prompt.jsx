import React from "react";
import { _ReactContext as RouterContext } from "./RouterContext";
export default function Prompt(props) {
  let value = React.useContext(RouterContext);
  React.useLayoutEffect(() => {
    if (props.when) {
      return value.history.block(props.message);
    }
  }, []);
  return null;
}
