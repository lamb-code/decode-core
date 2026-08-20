/* eslint-disable*/
//  主文件的作用一般就是整合操作
import { mapState, mapGetters } from "./helper";
import { Store, install } from "./store";
// 默认导出
export default {
  Store,
  install,
  mapState,
  mapGetters,
};
// 方便解构导入 用户可以使用 import {Store} from 'vuex'
export { Store, install, mapState, mapGetters };
