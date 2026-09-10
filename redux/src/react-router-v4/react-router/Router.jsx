import React from "react";
import RouterContext from "./RouterContext";
import { match } from "path-to-regexp";
export default class Router extends React.Component {
  static computedRootMatch(pathname) {
    return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
  }
  constructor(props) {
    super(props);
    this.state = {
      location: props.history.location,
    };
    //当监听到路由发生变化后会执行
    let listener = (location) => {
      this.setState({ location });
    };
    this.unlisten = props.history.listen(listener);
  }
  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    let value = {
      history: this.props.history,
      location: this.state.location,
      match:Router.computedRootMatch(this.state.location.pathname)
    };
    return (
      <RouterContext.Provider value={value}>
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}
