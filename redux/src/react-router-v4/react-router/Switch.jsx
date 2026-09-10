import React from "react";
import RouterContext from "./RouterContext";
import matchPath from "./matchPath";
export default class Switch extends React.Component {
  static contextType = RouterContext;
  render() {
    const { location } = this.context;
    let element, match;
    React.Children.forEach(this.props.children, (child) => {
      if (!match && React.isValidElement(child)) {
        element = child;
        // 兼容 Redirect：没有 path 时用 from，都没有则用根 match（总是匹配）
        const path = child.props.path || child.props.from;
        match = path
          ? matchPath(location.pathname, { ...child.props, path })
          : this.context.match;
      }
    });
    return match ? React.cloneElement(element, { computedMatch: match }) : null;
  }
}
