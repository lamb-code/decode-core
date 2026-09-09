import { useContext } from "react";
import ReactReduxContext from "../ReactReduxContext";
import { bindActionCreators } from "../../redux";
function useBundDispatch(actionCreators) {
  const { store } = useContext(ReactReduxContext);
  const bundActionCreators = bindActionCreators(actionCreators, store.dispatch);
  return bundActionCreators;
}
export default useBundDispatch;
