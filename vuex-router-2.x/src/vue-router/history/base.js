/* eslint-disable */
export function createRoute(record, location) {
    let res = []
    if (record) {
        while (record) {
            res.unshift(record)
            record = record.parent
        }
    }
    return {
        ...location,
        matched: res
    }
}
export default class History {
    constructor(router) {
        this.router = router
        this.current = createRoute(null, {
            path: '/'
        })
    }
    //location 代表表示要跳转的目的地 onComplete 当前跳转成功后执行的回调方法
    transitionTo(location, onComplete) {
        console.log(location, 'localtion')
        // route 形态 /about/a =>{path:'/about/a',matched:[About,AboutA]}
        let route = this.router.match(location) //用当前路径找出对应的记录
        if (this.current.path === location && route.matched.length === this.current.matched.length) return
        this.updateRoute(route)
        console.log(route, 'kkkkk')
        onComplete && onComplete()
    }
    updateRoute(route) {
        this.current = route
        this.cb && this.cb(route)
    }
    listen(cb) {
        this.cb = cb
    }
}