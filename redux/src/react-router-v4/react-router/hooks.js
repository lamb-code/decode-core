import React from "react";
import RouterContext from "./RouterContext";
import matchPath from "./matchPath";
export function useHistory() {
  const contextValue = React.useContext(RouterContext);
  return contextValue.history;
}
export function useLocation() {
  const contextValue = React.useContext(RouterContext);
  return contextValue.location;
}
export function useParams() {
  let { location } = React.useContext(RouterContext);
  let match = matchPath(location.pathname, { path });
  return match ? match.params : {};
}
export function useRouterMatch(path) {
  const location = useLocation();
  let match = React.useContext(RouterContext).match;
  return path ? matchPath(location.pathname, {path}) : match;
}
