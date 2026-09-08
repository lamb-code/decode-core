import { DECREMENT_THEME, INCREMENT_THEME } from "../reducer/actionTypes";

function increment() {
  return { type: INCREMENT_THEME };
}
function decrement() {
  return { type: DECREMENT_THEME };
}
const themeActionCreator ={increment,decrement}
export default themeActionCreator
