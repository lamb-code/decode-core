/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
/* eslint-disable semi */
//  主文件的作用一般就是整合操作

import { Store, install } from "./store";
// 默认导出
export default {
  Store,
  install
};
// 方便解构导入 用户可以使用 import {Store} from 'vuex'
export { Store, install };
