function createHashHistory(props) {
  let historyStack = []; //类似于历史栈
  let current = -1;
  let action = "POP";
  let state;
  let listeners = []; //监听函数组成的数组
  let message;
  let confirm = props.getUserConfirmation?props.getUserConfirmation:window.confirm
  function listen(listener) {
    listeners.push(listener);
    return () => (listener = listeners.filter((l) => l !== listener));
  }
  function hashChangeHandler() {
    let pathname = window.location.hash.slice(1);
    let location = { pathname, state };
    Object.assign(history, { action, location });
    if (action === "PUSH") {
      historyStack[++current] = location;
    }
    listeners.forEach((listener) => listener(history.location));
  }
  window.addEventListener("hashchange", hashChangeHandler);
  function go(step) {
    action = "POP";
    current += step;
    let nextLocation = historyStack[current];
    state = nextLocation.state;
    window.location.hash = nextLocation.pathname;
  }
  function goBack() {
    go(-1);
  }
  function goForward() {
    go(1);
  }
  function push(pathname, nextState) {
    action = "PUSH";
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
    window.location.hash = pathname;
  }
  function block(newMessage) {
    message = newMessage;
    return () => (message = null);
  }
  let history = {
    action: "POP",
    push,
    listen,
    go,
    goBack,
    goForward,
    block,
    location: { pathname: "/", state: undefined },
  };
  if (window.location.hash) {
    action = "PUSH";
    hashChangeHandler();
  } else {
    window.location.hash = "/";
  }
  return history;
}
export default createHashHistory;
