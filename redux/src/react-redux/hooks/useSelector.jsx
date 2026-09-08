import React, { useLayoutEffect, useReducer } from "react";
import ReactReduxContext from "../ReactReduxContext";
function useSelector(selector) {
  const { store } = React.useContext(ReactReduxContext);
  const state = store.getState();
  const selectedState = selector(state);
  const [, forcUpdate] = useReducer((x) => x + 1, 0);
  useLayoutEffect(() => {
    store.subscribe(() => {
      forcUpdate();
    });
  }, []);
  return selectedState;
}
export default useSelector;
