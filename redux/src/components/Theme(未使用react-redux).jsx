import store from "../store";
import { bindActionCreators } from "../redux";
import actionCreators from "../store/actionCreators/theme";
const bundActionCreators = bindActionCreators(actionCreators,store.dispatch)
export default function () {
  const { count } = store.getState().theme;
  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>手写 Redux Theme</h2>
      <div style={{ fontSize: 40, fontWeight: 700 }}>{count}</div>
      <button onClick={() => store.dispatch({ type: "INCREMENT_THEME" })}>
        +1
      </button>
      <button onClick={bundActionCreators.themeInc}>
        actioncreator +1
      </button>
      <button onClick={() => store.dispatch({ type: "DECREMENT_THEME" })}>
        -1
      </button>
    </div>
  );
}
