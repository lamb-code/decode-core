/* eslint-disable */
export function createRoute(record, location) {
  let res = [];
  if (record) {
    while (record) {
      res.unshift(record);
      record = record.parent; //parent 属性是之前addRouteRecord 就增加了
    }
  }
  return {
    ...location,
    matched: res,
  };
}

const runQueue = (queue, interator, complete) => {
  function next(index) {
    if (index >= queue.length) {
      return complete();
    }
    let hook = queue[index];
    interator(hook, () => {
      next(index + 1);
    });
  }
  next(0);
};
export default class History {
  constructor(router) {
    this.router = router;
    //current 存放的是当前匹配的记录
    //匹配记录逻辑应该是; 比如匹配'/' 那肯定是匹配到{path:"/",component:Home},'/about/a'的话应该存放两条记录 一个是'/about'对应的记录  一个是'/about/a'对应的记录,依次类推
    this.current = createRoute(null, {
      path: "/",
    });
  }
  //location 代表表示要跳转的目的地 onComplete 当前跳转成功后执行的回调方法
  transitionTo(location, onComplete) {
    console.log(location, "localtion");
    // route 形态 /about/a =>{path:'/about/a',matched:[About,AboutA]}
    // let route = this.router.matcher.match(location) //用当前路径找出对应的记录
    let route = this.router.match(location); //用当前路径找出对应的记录

    if (
      this.current.path === location &&
      route.matched.length === this.current.matched.length
    )
      return;
    const queue = this.router.beforeHooks;
    const inderator = (hook, next) => {
      hook(current, this.current, next);
    };
    runQueue(queue, inderator, () => {
      this.updateRoute(route);
      // console.log(route, 'kkkkk')
      onComplete && onComplete();
    });

    // this.updateRoute(route)
    // // console.log(route, 'kkkkk')
    // onComplete && onComplete()
  }
  updateRoute(route) {
    this.current = route;
    this.cb && this.cb(route);
  }
  //主要用在init 方法中 更新_router属性 这个属性具响应式
  listen(cb) {
    //这个cb 是init 方法history.listen的函数参数 主要功能 是把最新的route赋值到_router属性上
    this.cb = cb;
  }
}
