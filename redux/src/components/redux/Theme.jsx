import store from "../../store";
import { bindActionCreators } from "../../redux";
import { useSelector, useDispatch } from "../../react-redux";
import actionCreators from "../../store/actionCreators/theme";
const bundActionCreators = bindActionCreators(actionCreators, store.dispatch);
export default function () {
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch;
  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>手写 Redux Theme</h2>
      <div style={{ fontSize: 40, fontWeight: 700 }}>{theme.count}</div>
      <button onClick={() => dispatch(bundActionCreators.themeInc())}>
        +1
      </button>
      <button onClick={() => dispatch(bundActionCreators.themeInc())}>
        actioncreator +1
      </button>
      <button onClick={() => dispatch(bundActionCreators.themeDec())}>
        -1
      </button>
    </div>
  );
}
