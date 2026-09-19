/**
 * pure function 纯函数
 * 1.输出只依赖输入，不依赖外部变量
 * 2.不能修改函数作用域之外的变量
 */
let prefix = "$";
function sum(a, b) {
  return a + b;
}
function sum1(a, b) {
  return prefix + a + b;
}
function sum2(a, b) {
  prefix = "&";
  return a + b;
}
