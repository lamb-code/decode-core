export default function thunk({ getState, dispatch }) {
  return function (next) {
    //返回的就是我们改造后的dispatch方法
    return function (action) {
      if (typeof action === "function") {
        return action(getState, dispatch);
      }
      return next(action);
    };
  };
}
