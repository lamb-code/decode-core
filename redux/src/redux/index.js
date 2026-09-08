// 手写 redux 的公共出口（对应原生 redux 包的 index.js）
// 每写完一个文件，就在这里补一条导出
// export { createStore } from "./createStore.js";
export {default as createStore} from './createStore.js'
export {default as bindActionCreators} from './bindActionCreators.js'
export {default as combineReducers} from './combineReducers.js'

