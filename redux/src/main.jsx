import { createRoot } from "react-dom/client";
import {Provider} from './react-redux'
import store from "./store";
import Auth from "./components/redux/Auth";
import Theme from "./components/redux/Theme";
import ZustandCouner from "./components/zustand/Auth";
const root = createRoot(document.getElementById("root"));

function render() {
  root.render(
    <Provider store={store}>
      <Auth />
      <Theme />
      <ZustandCouner/>
    </Provider>
  );
}
render();

// 订阅 state 变化，重新渲染
store.subscribe(render);
