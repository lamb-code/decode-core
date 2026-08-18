import Dep from "./dep";
//当我们创建渲染watcher的时候我们会把当前渲染watcher放到Dep.target上
let id = 0;
//不同的组件有不同的watcher
// Wachter怎么使用？ 把渲染逻辑封装到Watcher里 mountComponent 挂载时候建个实例
//怎么让数据每个属性和这个watcher关联起来？ 需要给每个属性增加一个dep,目的及时搜集watcher
// watcher和dep对应关系？ 一个视图可以有多个属性(n个属性对应一个视图)，n个dep 对应一个watcher;一个属性可以对应多个视图即一个dep 对应多个watcher 总结多对多的关系
class Watcher {
  constructor(vm, fn, options) {
    this.id = id++;
    this.renderWatcher = options;
    this.getter = fn; // getter 意味着调用这个函数可以发生取值操作
    this.deps = [];
    this.depsId = new Set();
    this.get();
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.deps.push(dep);
      this.depsId.add(id);
      dep.addSub(this);
    }
  }
  get() {
    Dep.target = this; //静态属性只有一份
    this.getter();
    Dep.target = null;
  }
  update() {
    this.get();
  }
}
export default Watcher;
