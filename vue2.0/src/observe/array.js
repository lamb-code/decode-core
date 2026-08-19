//获取数组原来的方法
let oldArrayProto = Array.prototype; // 获取数组原型
//我们希望数组原来的方法都还存在就拷贝一份出来

//newArrayProto.__proto__=oldArrayProto
export let newArrayProto = Object.create(oldArrayProto);
let methods = ["push", "shift", "pop", "unshift", "reverse", "sort", "splice"];
methods.forEach((method) => {
  newArrayProto[method] = function (...args) {
    const result = oldArrayProto[method].call(this, ...args);
    //对新增的数据再次进行劫持
    // 可以添加自己逻辑，函数劫持，切片
    let inserted = [];
    let ob = this.__ob__;
    switch (method) {
      case "splice": // 修改 删除 添加
        inserted = args.slice(2); // splice 方法从第三个参数起，是增添的新数据
        break;
      case "push":
      case "unshift":
        inserted = args;
        break;
    }
    // inserted[] 遍历数组 看一下他是否需要进行二次劫持
    if (inserted) {
      //如果插入的是对象数组 还需要进行劫持
      //怎么拿到observeArray呢？唯一能拿到是this
      ob.observeArray(inserted);
    }
    ob.dep.notify(); // 触发页面更新流程
    return result;
  };
});
