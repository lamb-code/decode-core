export default function promise({ getState, dispatch }) {
  return function (next) {
    //返回的就是我们改造后的dispatch方法
    return function (action) {
      if (action.then && typeof action.then === "function") {
        action.then(dispatch);
      } else {
        next(action);
      }
    };
  };
}
