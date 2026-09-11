import React from "react";
import { createHashHistory, createBrowserHistory } from "../history";
import {
  Router,
  Routes,
  Route,
  useNavigate,
  Outlet,
  useParams,
  useLocation,
} from "../react-router";
export * from "../react-router";
export function HashRouter({ children }) {
  let historyRef = React.useRef(null);
  if (historyRef.current === null) {
    historyRef.current = createHashHistory();
  }
  let history = historyRef.current;
  let [state, setState] = React.useState({
    location: history.location,
    action: history.action,
  });
  React.useLayoutEffect(() => history.listen(setState), [history]);
  return (
    <Router
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    ></Router>
  );
}

export function BrowserRouter({ children }) {
  let historyRef = React.useRef(null);
  if (historyRef.current === null) {
    historyRef.current = createBrowserHistory();
  }
  let history = historyRef.current;
  let [state, setState] = React.useState({
    location: history.location,
    action: history.action,
  });
  React.useLayoutEffect(() => history.listen(setState), [history]);
  return (
    <Router
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    ></Router>
  );
}

export function Link({ to, children,...rest}) {
  const navigate = useNavigate();
  return (
    <a
      href={to}
      {...rest}
      onClick={(event) => {
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

export function NavLink({
  style: styleProp,
  className: classNameProp,
  end,
  children,
  to,
  ...rest
}) {
  const path = { pathname: to };
  const location = useLocation();
  const locationPathname = location.pathname;
  const toPathname = path.pathname;
  let isActive =
    locationPathname === toPathname ||
    (!end &&
      locationPathname.startsWith(toPathname) &&
      locationPathname.charAt(toPathname.lenth) === "/");
  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp({ isActive });
  }
  let style = {};
  if (typeof styleProp === "function") {
    style = styleProp({ isActive });
  }
  return <Link className={className} {...rest} to={to} style={style}>
    {children}
  </Link>;
}
