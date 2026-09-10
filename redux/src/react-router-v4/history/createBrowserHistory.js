export function createBrowserHistory(props) {
  const globalHistory = window.history;
  let state;
  let listeners = [];
  let message
  let confirm = props.getUserConfirmation?props.getUserConfirmation:window.confirm

  function push(pathname, nextState) {
    const action = "PUSH";
    if (typeof pathname === "object") {
      state = pathname.state;
      pathname = pathname.pathname;
    } else {
      state = nextState;
    }
    if(message){
      let showMessage=message({pathname})
      let allow = confirm(showMessage)
      if(!allow) return
    }
    globalHistory.pushState(state, null, pathname);
    let location = { pathname, state };
    notify(action, location);
  }
  function notify(action, location) {
    history.location = location;
    history.action = action;
    listeners.forEach((listener) => listener(history.location));
  }
  function listen(listener) {
    listeners.push(listener);
    return () => (listener = listeners.filter((l) => l !== listener));
  }
  window.addEventListener("popstate", () => {
    let location = {
      pathname: window.location.pathname,
      state: globalHistory.state,
    };
    notify("POP", location);
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
  function block(newMessage) {
    message = newMessage;
    return () => (message = null);
  }
  const history = {
    action: "POP",
    push,
    listen,
    go,
    goBack,
    goForward,
    block,
    location: {
      pathname: window.location.pathname,
      state: window.location.state,
    },
  };
  return history;
}
export default createBrowserHistory;
