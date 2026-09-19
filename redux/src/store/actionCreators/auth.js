import { DECREMENT_AUTH, INCREMENT_AUTH } from "../reducer/actionTypes";

function authInc() {
  return { type: INCREMENT_AUTH };
}
function authDec() {
  return { type: DECREMENT_AUTH };
}
function thunkAdd() {
  return function (getState, dispatch) {
    setTimeout(() => {
      dispatch({ type: INCREMENT_AUTH });
    }, 1000);
  };
}
function promiseAdd() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ type: INCREMENT_AUTH });
    }, 1000);
  });
}
const actionCreators = { authInc, authDec, thunkAdd,promiseAdd };
export default actionCreators;
