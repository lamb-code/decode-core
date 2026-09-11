import React from "react";

const NavigationContext = React.createContext({});
const LocationContext = React.createContext({});
const RouterContext = React.createContext({});
export { NavigationContext, LocationContext };
//变成正则表达式
function compilePath(path, end) {
  //路径参数名的数组
  let paramNames = [];
  let regexpSource =
    "^" +
    path
      .replace(/:(\w+)/g, (_, key) => {
        // /:id
        //先把收集到的路径参数名放到数组里暂存
        paramNames.push(key);
        return "([^/#?]+?)";
      })
      .replace(/^\/*/, "/");
  // regexpSource += "$";
  if (end) {
    regexpSource += "\\/*$";
  }
  let matcher = new RegExp(regexpSource);
  return [matcher, paramNames];
}

function matchPath({ path, end }, pathname) {
  // let matcher = compilePath(path);
  // let match = pathname.match(matcher)
  // return match

  // const [matcher, paramNames] = compilePath(path);

  const [matcher, paramNames] = compilePath(path, end);

  let match = pathname.match(matcher);
  if (!match) return null;
  const [matchedPathname, ...values] = match;
  let params = paramNames.reduce((memo, paramName, index) => {
    memo[paramName] = values[index];
    return memo;
  }, {});
  return {
    params,
    matchedPathname,
  };
}
function joinPaths(paths) {
  //替换斜杠 如 ['/user','/add'] 替换成 /user//add =>/user/add
  return paths.join("/").replace(/\/\/+/g, "/");
}
//将多维变成一维
function flattenRoutes(
  routes,
  branches = [],
  parentMetas = [],
  parentPath = ""
) {
  routes.forEach((route, index) => {
    //定义一个路由匹配的元数据：一个路由匹配一个meta
    let routeMeta = {
      route,
      relativePath: route.path,
    };
    let routePath = joinPaths([parentPath, route.path]);
    //把父亲的路由meta数组加上自己的meta数组变成一个新数组
    let routeMetas = [...parentMetas, routeMeta];
    if (route.children && route.children.length > 0) {
      flattenRoutes(route.children, branches, routeMetas, routePath);
    }
    branches.push({
      routePath,
      routeMetas,
    });
  });
  return branches;
}
function matchRouteBranch(branch, pathname) {
  const { routeMetas } = branch;
  let matches = [];
  //已经匹配过的路径名
  let matchedPathname = "";
  let matchedParams = {};
  for (let i = 0; i < routeMetas.length; i++) {
    const { route } = routeMetas[i];
    //判断是不是最后一个
    const end = i === routeMetas.length - 1;
    //用完整的路径截掉已经匹配的路径 得到剩下的路径
    const remainingPathname = pathname.slice(matchedPathname.length);
    let match = matchPath({ path: route.path, end }, remainingPathname);
    if (!match) return null;
    matchedParams = Object.assign({}, matchedParams, match.params);
    matches.push({ route, params: matchedParams });
    matchedPathname = joinPaths([matchedPathname, match.matchedPathname]);
  }
  return matches;
}
function matchRoutes(routes, pathname) {
  //打平所有的路径
  const branches = flattenRoutes(routes);
  console.log(branches);
  //一次进行分支的匹配
  let matches = null;
  for (let i = 0; matches === null && i < branches.length; i++) {
    matches = matchRouteBranch(branches[i], pathname);
  }
  console.log(matches, "matches");
  return matches;
}
function _renderMatches(matches) {
  if (!matches) return null;
  return matches.reduceRight((outlet, match, index) => {
    return (
      <RouterContext.Provider
        value={{ outlet, matches: matches.slice(0, index + 1) }}
      >
        {match.route.element}
      </RouterContext.Provider>
    );
  }, null);
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
  // const localtion = useLocation();
  // const pathname = localtion.pathname || "/";
  // for (let i = 0; i < routes.length; i++) {
  //   const { path, element } = routes[i];
  //   const match = matchPath(path, pathname);
  //   if (match) {
  //     return element;
  //   }
  // }
  // return null;

  // 嵌套路由：
  const location = useLocation();
  //获取当前的路径名
  const pathname = location.pathname;
  //使用地址栏中的路径名和routes数组进行匹配
  const matches = matchRoutes(routes, pathname);

  //渲染匹配的结果
  return _renderMatches(matches);
  // return null;
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
  return useOutlet();
}
export function useParams() {
  const {matches} = React.useContext(RouterContext)
  return matches[matches.length-1];
}

export function useOutlet(){
  return React.useContext(RouterContext).outlet
}