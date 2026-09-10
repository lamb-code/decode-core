import React from "react";
import RouterContext from "./RouterContext";
import matchPath from "./matchPath";

export default class Route extends React.Component {
  static contextType = RouterContext;

  render() {
    const { history, location } = this.context;
    const {
      component: RouteComponent,
      render,
      computedMatch,
      children,
    } = this.props;
    // const match = location.pathname===path
    const match = computedMatch
      ? computedMatch
      : matchPath(location.pathname, this.props);
    const routeProps = { history, location };
    let element = null;
    if (match) {
      routeProps.match = match;
      if (RouteComponent) {
        element = <RouteComponent {...routeProps} />;
      } else if (render) {
        element = render(routeProps);
      } else if (children) {
        element = children(routeProps);
      } else {
        element = null;
      }
    } else {
      if (children) {
        element = children(routeProps);
      } else {
        element = null;
      }
    }
    return element;
  }
}
