// 手写 Redux 第一课：createStore（最小可用版）
// 对照原生 redux：node_modules/redux/src/createStore.js
export default function createStore(reducer, preloadedState, enhancer) {
  if (typeof enhancer === "function") {
    return enhancer(createStore)(reducer, preloadedState);
  }

  let currentReducer = reducer;
  let currentState = preloadedState;
  let listeners = [];

  function getState() {
    return currentState;
  }

  function dispatch(action) {
    // 同步调用 reducer，产出新 state
    currentState = currentReducer(currentState, action);
    // 通知所有订阅者（发布订阅）
    for (const listener of listeners) {
      listener();
    }
    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);
    // 返回取消订阅函数
    return function unsubscribe() {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  function replaceReducer(nextReducer) {
    currentReducer = nextReducer;
    dispatch({ type: "@@redux/REPLACE" });
  }

  // 初始化 state
  dispatch({ type: "@@redux/INIT" });

  return { getState, dispatch, subscribe, replaceReducer };
}
