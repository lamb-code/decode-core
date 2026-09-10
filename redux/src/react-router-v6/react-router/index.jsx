import React from "react";

const NavigationContext = React.createContext({});
const LocationContext = React.createContext({});
export { NavigationContext, LocationContext };
export function Router({ children, location, navigator }) {
  const navigationContext = React.useMemo(() => ({ navigator }), [navigator]);
  const locationContext = React.useMemo(() => ({ location }), [location]);

  return (
    <NavigationContext.Provider value={navigationContext}>
      <LocationContext.Provider value={locationContext}>
        {children}
      </LocationContext.Provider>
    </NavigationContext.Provider>
  );
}
export function useLocation() {
  return React.useContext(LocationContext).location;
}
export function useRoutes(routes) {
  const localtion = useLocation();
  const pathname = localtion.pathname || "/";
  for (let i = 0; i < routes.length; i++) {
    const { path, element } = routes[i];
    const match = matchPath(path, pathname);
    if (match) {
      return element;
    }
  }
  return null;
}
//变成正则表达式
function compilePath(path) {
  let regexp = "^" + path;
  regexp += "$";
  return new RegExp(regexp);
}
function matchPath(path, pathname) {
  let matcher = compilePath(path);
  let match = pathname.match(matcher)
  return match
}
export function Route() {}
export function Routes({ children }) {
  const routes = createRoutesFromChildren(children);
  console.log(routes, "routes");
  return useRoutes(routes);
}
//根据子元素创建路由配置数组
export function createRoutesFromChildren(children) {
  let routes = [];
  React.Children.forEach(children, (child) => {
    let route = {
      path: child.props.path,
      element: child.props.element,
    };
    routes.push(route);
  });
  return routes;
}
