function createBrowserHistory() {
  const globalHistory = window.history;
  let state;
  let listeners = [];

  function push(pathname, nextState) {
    const action = "PUSH";
    if (typeof pathname === "object") {
      state = pathname.state;
      pathname = pathname.pathname;
    } else {
      state = nextState;
    }
    globalHistory.pushState(state, null, pathname);
    let location = { pathname, state };
    notify({ action, location });
  }
  function replace(pathname, nextState) {
    const action = "REPLACE";
    if (typeof pathname === "object") {
      state = pathname.state;
      pathname = pathname.pathname;
    } else {
      state = nextState;
    }
    globalHistory.replaceState(state, null, pathname);
    let location = { pathname, state };
    notify({ action, location });
  }
  function notify({ action, location }) {
    history.location = location;
    history.action = action;
    listeners.forEach((listener) => listener({ action, location }));
  }
  function listen(listener) {
    listeners.push(listener);
    return () => (listener = listeners.filter((l) => l !== listener));
  }
  window.addEventListener("popstate", () => {
    let location = {
      pathname: globalHistory.pathname,
      state: globalHistory.state,
    };
    notify({ action: "POP", location });
  });
  function go(step) {
    globalHistory.go(step);
  }
  function goBack() {
    globalHistory.go(-1);
  }
  function goForward() {
    globalHistory.go(1);
  }
  const history = {
    action: "POP",
    push,
    listen,
    go,
    goBack,
    goForward,
    replace,
    // block,
    location: {
      pathname: window.location.pathname,
      state: globalHistory.state,
    },
  };
  return history
}
export default createBrowserHistory;
