let id = 0;
//dep 需要搜集watcher
class Dep {
  constructor() {
    this.id = id++;
    this.subs = []; // 存放当前属性对应的watcer 搜集到的watcher
  }
  depend() {
    // this.subs.push(Dep.target); //直接push导致问题?不需要放置重复的watcher 而且还需要watcer 记录dep
    //Dep.target 就是当前渲染的watcher
    Dep.target.addDep(this); //先让watcher记录dep 然后 addSub dep记录watcher
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach((watcher) => {
      watcher.update();
    });
  }
}
Dep.target = null;
let stact = [];
export function pushTarget(watcher) {
  stact.push(watcher);
  Dep.target = watcher;
}
export function popTarget(watcher) {
  stact.pop();
  Dep.target = stact[stact.length - 1];
}
export default Dep;
