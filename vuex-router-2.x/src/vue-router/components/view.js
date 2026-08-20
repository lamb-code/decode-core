
/* eslint-disable */

export default {
    functional: true, //表示函数式组件，但是没有this
    render(h, { parent, data }) { //{ parent, data } 是解构了context上下文，parent是当前父组件实例 data是这个组件上的一些标识
        // /about/a =>matched =[about abouta]
        let route = parent.$route
        let matched = route.matched
        data.routerView = true //标识是路由视图
        let depth = 0
        while (parent) {
            if (parent.$vnode && parent.$vnode.data.routerView) {//一直往上找看自己是第几层router-view 然后 再去matched取组件
                depth++
            }
            parent = parent.$parent
        }
        let record = matched[depth]
        if (!record) {
            return h()
        }
        let component = record.component
        return h(component, data)
    },
}
