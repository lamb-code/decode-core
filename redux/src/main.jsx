import { createRoot } from "react-dom/client";
import {Provider} from 'react-redux'
import store from "./store";
import Auth from "./components/Auth";
import Theme from "./components/Theme";
const root = createRoot(document.getElementById("root"));

function render() {
  root.render(
    <Provider store={store}>
      <Auth />
      <Theme />
    </Provider>
  );
}
render();

// 订阅 state 变化，重新渲染
store.subscribe(render);
