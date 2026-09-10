function createHashHistory() {
  let stack = [];
  let index = -1;
  let action = "POP";
  let state;
  let listeners = []; //监听函数组成的数组
  function push(pathname, nextState) {
    const action = "PUSH";
    if (typeof pathname === "object") {
      state = pathname.state;
      pathname = pathname.pathname;
    } else {
      state = nextState;
    }
    window.location.hash = pathname;
  }
  function listen(listener) {
    listeners.push(listener);
    return () => (listener = listeners.filter((l) => l !== listener));
  }
  function go(step) {
    action = "POP";
    index += step;
    let nextLocation = stack[index];
    state = nextLocation.state;
    window.location.hash = nextLocation.pathname;
  }
  function goBack() {
    go(-1);
  }
  function goForward() {
    go(1);
  }
  const history = {
    action: "POP",
    push,
    listen,
    go,
    goBack,
    goForward,
    // replace,
    // block,
    location: {
      pathname: window.location.hash ? window.location.hash.slice(1) : "/",
      state: undefined,
    },
  };
  function hashChangeHandler() {
    let pathname = window.location.hash.slice(1);
    history.action = action;
    let location = { pathname, state };
    history.location = location;
    if (action === "PUSH") {
      stack[++index] = history.location;
    }
    listeners.forEach((listener) => listener({ action, location }));
  }
  if (window.location.hash) {
    action = "PUSH";
    hashChangeHandler();
  } else {
    window.location.hash = "/";
  }
  window.addEventListener("hashchange", hashChangeHandler);

  return history;
}
export default createHashHistory;
