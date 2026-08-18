import { newArrayProto } from "./array";

class Observer {
  constructor(data) {
    // data.__ob__ = this // 给对象和数组添加一个自定义属性,为了重写array数组方法拿到observeArray方法且加了个标识区分数据是否被劫持过，但是直接这样会造成死循环，需要不能枚举属性
    Object.defineProperty(data,'__ob__',{
      value:this,
      enumerable:false //表示这个属性不能被列举出来，不能被循环到
    })
    if (Array.isArray(data)) {
      // 更改数组原型方法, 如果是数组,就重写数组的原型链
      data.__proto__ = newArrayProto
      this.observeArray(data)
    } else {
      // 如果给一个对象添加一个不存在的属性，我希望也能更新视图{}.dep Object. 只能劫持已经存在的属性(vue内部会单独写一些api $set $delete)
      this.walk(data);
    }
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      // 使用defineProperty重新定义属性(之所以vue2性能较3差)
      defineReactive(data, key, data[key]); //defineReactive不写在内部，方便后面可以单独使用
    });
  }
  observeArray(data) {
    // 递归遍历数组,对数组内部的对象再次重写[[]] [{}]
    data.forEach((item) => {
      // 数组里如果是引用类型,那么是响应式
      observe(item);
    });
  }
}
export function defineReactive(target, key, value) {
  let childOb = observe(value); // 递归进行观测数据. 不管有多少层,我都进行defineProperty

  //defineReactive 闭包函数
  Object.defineProperty(target, key, {
    //取值的时候执行get
    get() {
      console.log("取值02");

      return value;
    },
    //设置值的时候执行set
    set(newValue) {
      if (newValue === value) return;
      observe(value); //为什么这还需要observe 防止 vm.object1={ num:2} 直接赋值
      value = newValue;
    },
  });
}
export function observe(data) {
  //对对象进行劫持
  if (typeof data !== "object" || data == null) {
    return;
  }
  if (value.__ob__) return // 一个对象不需要重新被观测

  // 2.需要对 对象进行观测, 最外层必须是一个{}, 不能是数组
  // 如果一个数据已经被观测过了, 就不要在进行观测了, 用类来实现, 观测过就增加一个标识,再观测的时候,可以先检测是否观测过,观测过了就跳过检测
  return new Observer(data);
}
