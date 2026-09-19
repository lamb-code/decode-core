export default function compose(...funcs) {
  return function (args) {
    for (let i = funcs.length - 1; i >= 0; i--) {
      args = funcs[i](args);
    }
    return args;
  };
}
//新版本源码写法
function test(...funcs){
  return funcs.reduce((a,b)=>(...args)=>a(b(...args)))
}