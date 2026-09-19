export default function logger({ getState, dispatch }) {
    return function (oldDispatch) {//返回的就是我们改造后的dispatch方法
      return function (action) {
        console.log("老状态", getState());
        oldDispatch(action);
        console.log("新状态", getState());
        return action;
      };
    };
  }