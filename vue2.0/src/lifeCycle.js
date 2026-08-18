export function lifecycleMixin(Vue){
    Vue.prototype._update=function(){

    }
    Vue.prototype._render=function(){

    }
}
export function mountComponent(vm,el){
    //挂载元素分三步：

    //1. 调用render方法生成虚拟DOM
    vm._update(vm._render())
    //2.根据虚拟DOM生成真实DOM
    //3.插入到el元素中
}