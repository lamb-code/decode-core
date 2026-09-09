import { createStore,applyMiddleware } from "../redux";
import reducer from "./reducer";
// const store = createStore(reducer);
//中间件基础原理:实现异步+1
// const oldDispatch = store.dispatch;
// store.dispatch= function(action){
//     setTimeout(() => {
//         oldDispatch(action)
//     }, 1000);
// }
//可以实现打印日志
// store.dispatch= function(action){
//    console.log('老状态',store.getState())
//    oldDispatch(action)
//    console.log('新状态',store.getState())

// }

function logger({ getState, dispatch }) {
  return function (oldDispatch) {//返回的就是我们改造后的dispatch方法
    return function (action) {
      console.log("老状态", getState());
      oldDispatch(action);
      console.log("新状态", getState());
      return action;
    };
  };
}
const store = applyMiddleware(logger)(createStore)(reducer)
export default store;
