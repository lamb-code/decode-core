import { createRoot } from "react-dom/client";
import store from "./store";
import Auth from "./components/Auth";
import Theme from "./components/Theme";
const root = createRoot(document.getElementById("root"));

function render() {
  root.render(
    <>
      <Auth />
      <Theme />
    </>
  );
}
render();

// 订阅 state 变化，重新渲染
store.subscribe(render);
