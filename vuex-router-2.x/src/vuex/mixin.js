/* eslint-disable */
const appllyMixin = (Vue) => {
  // 插件的混一般放在beforCreated
  Vue.mixin({
    beforeCreate: vuexInit,
  });
};
//  组件的创建过程 是先父后子
function vuexInit() {
  //  vue-router 是把属性定义到
  const options = this.$options;
  //这个目的就是让组件都有$store属性,应为只有根组件才有store属性
  if (options.store) {
    this.$store = options.store;
  } else if (options.parent && options.parent.$store) {
    this.$store = options.parent.$store;
  }
}
export default appllyMixin;
