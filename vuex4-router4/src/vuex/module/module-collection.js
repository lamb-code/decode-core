import { forEachValue } from "../utils";
import Module from "./module";
export default class ModuleCollection {
  constructor(rootModule) {
    this.root = null;
    this.register(rootModule, []);
  }
  register(rawModule, path) {
    const newModule = new Module(rawModule);
    // rawModule.newModule = newModule
    if (path.length == 0) {
      //path.length ==0是 根模块
      this.root = newModule;
    } else {
      // 父级怎么取?
      /**
       * path: 数组，代表当前模块从根节点走到自身的完整路径
       * 举个例子:
       * { modules:{ a:{ modules:{ b:{} } } } }
       * 模块 b 的 path = ['a','b']
       * this.root: 根模块对象（最顶层的 Module 实例）
       * path.slice(0, -1) 切掉数组最后一项，得到【父路径】
       * reduce 从根模块开始，顺着父路径一级一级向下查找，最终返回当前模块的父模块
       */
      const parent = path.slice(0, -1).reduce((module, current) => {
        /**
         * @param module 累加器：当前走到的模块对象
         * @param current 当前遍历的路径名称（子模块名）
         * @return 返回下一层子模块对象，作为下一轮循环的 module
         */
        // 调用模块身上的 getChild 方法，取出名为 current 的子模块
        return module.getChild(current);
      }, this.root); // reduce初始值：查找的起点永远是根模块
      parent.addChild(path[path.length - 1], newModule);
    }
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(rawChildModule, path.concat(key));
      });
    }
    return newModule
  }
  getNamespaced(path) {
    let module = this.root;
    return path.reduce((namespacedStr, key) => {
        module = module.getChild(key); //子模块
      return namespacedStr + (module.namespaced ? key + "/" : "");
    }, "");
  }
}
