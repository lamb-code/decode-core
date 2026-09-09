import { DECREMENT_AUTH, INCREMENT_AUTH } from "../reducer/actionTypes";

function authInc() {
  return { type: INCREMENT_AUTH };
}
function authDec() {
  return { type: DECREMENT_AUTH };
}
const actionCreators = { authInc, authDec };
export default actionCreators;
