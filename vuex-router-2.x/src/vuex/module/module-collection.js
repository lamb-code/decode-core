/* eslint-disable */

import { forEachValue } from "../util";
import Module from "./module";
export default class ModuleCollection {
  constructor(options) {
    // console.log(options);
    //注册模块 递归注册模块,利用数组递归
    this.register([], options);
  }
  register(path, rootModule) {
    // let newModule = {
    //     _raw: rootModule,
    //     _children: {},
    //     state: rootModule.state
    // }
    let newModule = new Module(rootModule);
    if (path.length === 0) {
      this.root = newModule;
    } else {
      // let parent = path.slice(0,-1).reduce((memo,current)=>{
      //     return memo._children[current]
      // },this.root)
      // parent._children[path[path.length - 1]] = newModule

      let parent = path.slice(0, -1).reduce((memo, current) => {
        return memo.getChild(current);
      }, this.root); //需要理解这个执行逻辑
      parent.addChild(path[path.length - 1], newModule);
      // parent._children[path[path.length - 1]] = newModule
    }
    if (rootModule.modules) {
      forEachValue(rootModule.modules, (module, moduleName) => {
        this.register([...path, moduleName], module);
      });
    }
  }
}
//格式化形态
// this.root={
//     _raw:xxx,
//     _children:{
//         a:{
//             _raw:xxx,
//             state:a.a.state
//         }
//     },
//     state:xxx.state
// }
