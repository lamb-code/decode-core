import React from "react";

const NavigationContext = React.createContext({});
const LocationContext = React.createContext({});
export { NavigationContext, LocationContext };
//变成正则表达式
function compilePath(path) {
  //路径参数名的数组
  let paramNames = [];
  let regexpSource =
    "^" +
    path.replace(/:(\w+)/g, (_, key) => {
      // /:id
      //先把收集到的路径参数名放到数组里暂存
      paramNames.push(key);
      return "([^/#?]+?)";
    });
  regexpSource += "$";
  let matcher = new RegExp(regexpSource);
  return [matcher, paramNames];
}

function matchPath(path, pathname) {
  // let matcher = compilePath(path);
  // let match = pathname.match(matcher)
  // return match
  const [matcher, paramNames] = compilePath(path);
  let match = pathname.match(matcher);
  if (!match) return null;
  const [matchedPathname, ...values] = match;
  let params = paramNames.reduce((memo, paramName, index) => {
    memo[paramName] = values[index];
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    path,
  };
}
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
    console.log(match, "match");
    if (match) {
      return element;
    }
  }
  return null;
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
    if (child.props.children) {
      route.children = createRoutesFromChildren(child.props.children);
    }
    routes.push(route);
  });
  return routes;
}

export function useNavigate() {
  const { navigator } = React.useContext(NavigationContext);
  let navigate = React.useCallback(
    (to) => {
      navigator.push(to);
    },
    [navigator]
  );
  return navigate;
}

export function Outlet() {
  return null;
}
export function useParams() {
  return { name: "test" };
}
