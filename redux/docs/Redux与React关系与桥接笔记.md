# Redux 与 React 的关系与桥接笔记

> 配套项目：`F:\源码手写解析\decode-core\redux`（手写 Redux 源码学习）
> 关联学习：手写 `createStore.js` 已完成，本笔记为手写 `react-redux`（Provider / useSelector / useDispatch）做铺垫。

---

## 一、本质关系：两个互相独立的库

| | React | Redux |
|---|---|---|
| 定位 | UI 库，只管组件树怎么渲染 | 状态容器，只管状态怎么存、怎么变 |
| 依赖关系 | 不依赖 Redux | 不依赖 React（可在纯 Node 环境跑） |
| 数据流 | 单向：props 向下 | 单向：dispatch → reducer → state |
| 官方定义 | A JavaScript library for building user interfaces | A Predictable State Container for JS Apps |

**结论**：Redux 和 React 本来没有任何关系。Redux 可以配 React、配 Vue、配原生 JS 用。

验证方法（你的项目里就可以做）：

```bash
node -e "const { createStore } = require('redux'); const s = createStore((st=0,act)=>act.type==='+'?st+1:st); s.dispatch({type:'+'}); console.log(s.getState())"  # 输出 1，全程没有 React
```

---

## 二、没有 react-redux 时，Redux 也能用（你现在的 Counter 就是）

手写 `createStore` 暴露了三个方法，这就是 Redux 的"接口面"：

```js
const store = createStore(reducer)
store.getState()    // 读状态
store.dispatch({ type: 'INCREMENT' })  // 改状态
store.subscribe(fn) // 订阅变化
```

手动桥接写法（`src/main.jsx` 现在就是这个套路）：

```jsx
function render() { root.render(<Counter />) }
render()
store.subscribe(render)          // 每次 dispatch 后手动重新渲染整棵树
```

**痛点**：
1. 每次 dispatch 后整棵树重渲染，浪费
2. 组件卸载后忘了 `unsubscribe()` 会内存泄漏
3. 多个组件要共享 store，就得层层往下传 props
4. 想只订阅某一块 state（比如只关心 `count`），得自己写判断

**react-redux 就是解决这些痛点的官方"桥"。**

---

## 三、桥的两端与三种搭桥方式

```
┌─────────────────────────────────────────────┐
│  React 组件层（Counter）                      │
│  useSelector(state => state.count)          │
│  useDispatch()                               │
└──────────────────┬──────────────────────────┘
                   │ 桥：react-redux
┌──────────────────▼──────────────────────────┐
│  Provider（Context 向下提供 store）           │
│  useSelector / useDispatch / connect         │
└──────────────────┬──────────────────────────┘
                   │ store 的接口面
┌──────────────────▼──────────────────────────┐
│  Redux store                                 │
│  getState()  dispatch()  subscribe()         │
│  └─ reducer（纯函数）                        │
└─────────────────────────────────────────────┘
```

### 方式一：老时代 —— connect 高阶组件（react-redux v5/v6）

```jsx
connect(mapStateToProps, mapDispatchToProps)(Counter)

// mapStateToProps: state => ({ count: state.count })     把 state 映射成 props
// mapDispatchToProps: dispatch => ({ add: () => dispatch({type:'INCREMENT'}) })  把 dispatch 包装成 props
```

原理：connect 返回一个高阶组件，它内部做了三件事——读 Context 拿 store、`store.subscribe` 订阅、把映射结果注入子组件 props。

### 方式二：新时代 —— hooks（react-redux v7/v8，配 React 18）

```jsx
import { Provider, useSelector, useDispatch } from 'react-redux'

// 入口包一层 Provider
<Provider store={store}>
  <Counter />
</Provider>

// 组件里
const count = useSelector(state => state.count)   // 订阅并选择 state 片段
const dispatch = useDispatch()                     // 拿到 dispatch
dispatch({ type: 'INCREMENT' })
```

### 方式三：手写版（你的下一步）—— 两个核心实现

```jsx
// Provider 本质：用 Context 把 store 传下去
const StoreContext = createContext(null)
function Provider({ store, children }) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

// useSelector 本质：订阅 + 取快照（React 18 的 useSyncExternalStore）
function useSelector(selector) {
  const store = useContext(StoreContext)
  return useSyncExternalStore(
    store.subscribe,                       // 订阅：变化时触发重渲染
    () => selector(store.getState())       // 快照：取当前选中的 state 片段
  )
}

// useDispatch 本质
function useDispatch() {
  const store = useContext(StoreContext)
  return store.dispatch
}
```

> `useSyncExternalStore(subscribe, getSnapshot)` 是 React 18 提供的官方"外部 store 订阅"入口，专门解决并发渲染下的 tearing（撕裂）问题——同一时刻组件读到的快照必须一致。

---

## 四、桥接通后的单向数据流（完整闭环）

```
用户点击 +1 按钮
      │
      ▼
dispatch({ type: 'INCREMENT' })      ← useDispatch 拿到的 dispatch
      │
      ▼
reducer(state, action)               ← 纯函数，算出新 state
      │
      ▼
store 保存新 state，触发所有订阅者
      │
      ▼
useSelector 的订阅回调被调用         ← 订阅者是 react-redux 注册的
      │
      ▼
selector(state) 重新计算 → 值变了 → 组件重渲染
```

**关键点**：Redux 自己不知道 React 的存在。`store.subscribe` 只是把回调存起来、dispatch 后逐个调用。react-redux 负责把"订阅回调"变成"触发组件重渲染"。这就是"桥"的全部含义。

---

## 五、手动桥接 vs react-redux 对照

| 需求 | 手动写 | react-redux |
|---|---|---|
| 提供 store | 层层 props 传递 | Provider + Context |
| 读 state | store.getState() | useSelector（自动订阅，只订阅选中的片段） |
| 改 state | store.dispatch() | useDispatch() |
| 触发重渲染 | 手动 root.render() / setState | useSyncExternalStore 自动触发 |
| 清理订阅 | 手动 unsubscribe | 组件卸载自动清理 |
| 避免多余渲染 | 自己判断 | 内部做浅比较优化 |

---

## 六、一句话总结

- **React 管"怎么画"，Redux 管"状态怎么变"，两者独立。**
- **react-redux 是桥**：一头接 `store.getState / dispatch / subscribe`（Redux 的接口面），一头接组件的"读 state + 发 action + 重渲染"（React 的机制）。
- **桥的本质就三行**：Context 传 store、subscribe 订阅、getSnapshot 读快照。

## 七、对照原生源码

| 手写文件 | 原生对照 |
|---|---|
| `src/redux/createStore.js`（已完成） | `node_modules/redux/src/createStore.js` |
| `src/react-redux/Provider.jsx`（待写） | `node_modules/react-redux/lib/components/Provider.js` |
| `src/react-redux/useSelector.js`（待写） | `node_modules/react-redux/lib/hooks/useSelector.js` |
| `src/react-redux/useDispatch.js`（待写） | `node_modules/react-redux/lib/hooks/useDispatch.js` |

> 注：项目里目前只装了原生 `redux` 做对照；写 react-redux 时可加装 `npm i react-redux@8` 做对照参考。

---

## 八、老版 vs 新版的基本使用方法

> 说明：下面示例里的 `react-redux` 导入会走你项目的别名（`src/react-redux`）。要跑起来，要么先手写自己的实现，要么临时去掉别名后 `npm i react-redux@8` 对照测试。

### 8.1 老版：connect 高阶组件（react-redux v5/v6，React 16/17 时代）

```jsx
// main.jsx —— 入口
import { createRoot } from "react-dom/client";
import { Provider, connect } from "react-redux";   // 桥
import { createStore } from "redux";               // 核心
import counterReducer from "./store/reducer.js";

const store = createStore(counterReducer);

// 组件本身"纯"：只接收 props，完全不知道 redux 存在
function Counter({ count, add, sub }) {
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={add}>+1</button>
      <button onClick={sub}>-1</button>
    </div>
  );
}

// 参数 1：把 state 映射成 props
const mapStateToProps = (state) => ({ count: state.count });

// 参数 2：把 dispatch 包装成 props 里的函数
const mapDispatchToProps = (dispatch) => ({
  add: () => dispatch({ type: "INCREMENT" }),
  sub: () => dispatch({ type: "DECREMENT" }),
});

// connect 返回一个"高阶组件"：内部自动订阅 store、自动重渲染、卸载自动清理
const ConnectedCounter = connect(mapStateToProps, mapDispatchToProps)(Counter);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ConnectedCounter />
  </Provider>
);
```

老版要点：
1. `connect(mapStateToProps, mapDispatchToProps)(组件)` 是固定三段式。
2. 订阅、重渲染、清理全部由 connect 内部完成，组件保持纯函数（只依赖 props）。
3. `Provider` 负责用 Context 把 store 传下去（老版新版的入口都一样）。
4. 老版还可以配 `connect(null, mapDispatchToProps)` 或 `connect(mapStateToProps)`，不用的参数传 null。

### 8.2 新版：hooks（react-redux v7.1+/v8，配 React 18）

```jsx
// main.jsx —— 入口（和老板版一样，Provider 包一层）
import { createRoot } from "react-dom/client";
import { Provider, useSelector, useDispatch } from "react-redux";
import { createStore } from "redux";
import counterReducer from "./store/reducer.js";

const store = createStore(counterReducer);

function Counter() {
  const count = useSelector((state) => state.count);  // 订阅 + 选择 state 片段
  const dispatch = useDispatch();                     // 直接拿 dispatch
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+1</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-1</button>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Counter />
  </Provider>
);
```

新版要点：
1. 不需要 connect 包裹，组件里直接调 hooks，代码更直白。
2. `useSelector(selector)` 自动订阅 store，**selector 的返回值变了才重渲染**（内部浅比较）。
3. `useDispatch()` 就是 `() => store.dispatch`（从 Context 取 store）。
4. 原理：`useSelector` 内部用的是 React 18 的 `useSyncExternalStore(store.subscribe, () => selector(store.getState()))`。

### 8.3 新老对照

| 维度 | 老版 connect | 新版 hooks |
|---|---|---|
| 写法 | `connect(mapStateToProps, mapDispatchToProps)(Comp)` | 组件内 `useSelector` / `useDispatch` |
| 订阅与重渲染 | connect 内部完成 | useSelector 内部完成（useSyncExternalStore） |
| 组件形态 | 类组件/函数组件都可以 | 函数组件 |
| 重渲染控制 | mapStateToProps + 浅比较 | selector 返回值比较 |
| 心智负担 | 高阶组件嵌套，认知成本高 | hooks 直观，无包裹 |

---

## 九、redux 与 react-redux 的区别与关系

### 9.1 一句话区别

**redux 是"状态管理核心"（与 UI 框架无关的引擎）；react-redux 是"React 专属的绑定层"（把引擎接进 React 组件的胶水）。** redux 里没有任何 React 代码，react-redux 里全是 React 代码。

### 9.2 对比表

| 维度 | redux | react-redux |
|---|---|---|
| 定位 | 状态容器（核心引擎） | React 绑定层（桥/胶水） |
| 提供 API | `createStore` `combineReducers` `applyMiddleware` `bindActionCreators` `compose` | `Provider` `connect` `useSelector` `useDispatch` `useStore` |
| 依赖 | 不依赖任何框架 | 依赖 `react` + `redux`（peerDependencies） |
| 含 React 代码 | 否 | 是 |
| 运行环境 | 任何 JS 环境（Node 也能跑） | 只能在 React 项目里 |
| 单独能用吗 | 能（手动 getState/dispatch/subscribe） | 不能（没有 store 就没东西可绑） |
| 手写位置 | `src/redux/` | `src/react-redux/` |

### 9.3 分层与依赖方向

```
React 组件（Counter）
   │ 使用
   ▼
react-redux（绑定层）  ← 依赖：react + redux
   │ import 依赖
   ▼
redux（核心引擎）      ← 不依赖任何框架
```

- 依赖只朝一个方向：**组件 → react-redux → redux**。
- redux 不认识 react-redux，也不认识 React。

### 9.4 关系要点

1. **依赖单向**：`react-redux` 依赖 `redux`（peerDependencies）；`redux` 完全不依赖 react-redux / react。
2. **使用顺序**：先 `createStore` 造出 store（redux 的事），再用 `<Provider store={store}>` 接进 React（react-redux 的事）。
3. **可分离**：不用 react-redux，Redux + React 照样能用（手动 `subscribe(render)`）；反过来没有 redux，react-redux 就是个空壳。
4. **对源码学习的意义**：`src/redux/`（已完成 createStore）负责"状态引擎"，`src/react-redux/`（待写）负责"桥"，`useSelector` 里要订阅你自己写的 `createStore` 产出的 store——两层代码在项目里天然分层，和原生包的分层一模一样。
5. **类比**：redux = 发动机（动力逻辑），react-redux = 变速箱/方向盘（只负责把动力传给 React 这辆车）；或 redux = 后厨做菜逻辑，react-redux = 服务员，只把菜端给 React 组件。
