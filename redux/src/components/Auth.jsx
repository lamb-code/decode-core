import store from "../store";
export default function () {
  const { count } = store.getState().auth;
  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>手写 Redux Counter--Auth</h2>
      <div style={{ fontSize: 40, fontWeight: 700 }}>{count}</div>
      <button onClick={() => store.dispatch({ type: "INCREMENT_AUTH" })}>
        +1
      </button>
      <button onClick={() => store.dispatch({ type: "DECREMENT_AUTH" })}>
        -1
      </button>
    </div>
  );
}
