import { createRoot } from "react-dom/client";
import { HashRouter, Route, Switch, Redirect, Link } from "./react-router-v4";
import { observable } from "./mobx";
import { Provider } from "./react-redux";
import store from "./store";
import Auth from "./components/redux/Auth";
import Theme from "./components/redux/Theme";
import ZustandCouner from "./components/zustand/Auth";
import Home from "./views/Home";
import User from "./views/User";
import Profile from "./views/Profile";
import UserDetail from "./views/UserDetail";

const root = createRoot(document.getElementById("root"));
function render() {
  root.render(
    <Provider store={store}>
      <HashRouter>
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to="/user">用户</Link>
          </li>
          <li>
            <Link to="/profile">个人中心</Link>
          </li>
        </ul>
        <Switch>
          <Route exact={true} path="/" component={Home}></Route>
          <Route path="/user" component={User}></Route>
          <Route path="/profile" component={Profile}></Route>
          <Route path="/user/detail/:id" component={UserDetail}></Route>
          <Redirect to="/"></Redirect>
        </Switch>
      </HashRouter>
      <Auth />
      <Theme />
      <ZustandCouner />
    </Provider>
  );
}
render();

// 订阅 state 变化，重新渲染
store.subscribe(render);

const obj = { name: "test" };
let proxyObj = observable(obj);
console.log(proxyObj);

class Doubler {
  value;
  constructor(value) {
    this.value = value;
  }
  get double() {
    return this.value * 2;
  }
}
let doubler = new Doubler(1);

doubler.value = 3;
