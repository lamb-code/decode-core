import { combineReducers } from "redux";
import auth from "./auth";
import theme from "./theme";
const reducer = combineReducers({ auth, theme });
export default reducer
