import React from "react";
import { createHashHistory, createBrowserHistory } from "../history";
import { Router,useNavigate } from "../react-router";
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

export function Link({ to, children }) {
  const navigate = useNavigate();
  return (
    <a
      href={to}
      onClick={(event) => {
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
