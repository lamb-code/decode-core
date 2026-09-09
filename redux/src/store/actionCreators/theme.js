import { DECREMENT_THEME, INCREMENT_THEME } from "../reducer/actionTypes";

function themeInc() {
  return { type: INCREMENT_THEME };
}
function themeDec() {
  return { type: DECREMENT_THEME };
}
const themeActionCreator ={themeInc,themeDec}
export default themeActionCreator
