import { useCouterStore } from "../../zustand-store";
function ZustandCouner() {
  const { count, add, minus,asyncAdd } = useCouterStore();
  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>手写 zustand</h2>
      <div style={{ fontSize: 40, fontWeight: 700 }}>{count}</div>
      <button onClick={add}>+1</button>
      <button onClick={asyncAdd}>异步 +1</button>
      <button onClick={minus}>-1</button>
    </div>
  );
}

export default ZustandCouner;
