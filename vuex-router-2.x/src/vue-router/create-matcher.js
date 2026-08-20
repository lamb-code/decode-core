/* eslint-disable */
import createRouteMap from "./create-route-map"
import { createRoute } from "./history/base"
export default function createMatcher(routes) {
    //pathList会把所有路由组成一个数组形态:[/,/about,/about/a]
    //pathMap搜集的是一对一的关系形态:{/：记录1，/about：记录2,/about/a：记录2}
    let { pathList, pathMap } = createRouteMap(routes) //初始化路由
    //试试addRoutes,
    // addRoutes([{path:"/kkk",component:{}}])
    console.log(pathList, pathMap)
    //
    function addRoutes(routes) {
        createRouteMap(routes, pathList, pathMap)
    }
    //通过用户输入的路径 获取对应的匹配记录
    function match(location) {
        //找到当前的记录
        //需要找到对应记录 并且要根据记录产生一个匹配的数组
        let record = pathMap[location]
        if (record) {
            return createRoute(record, {
                path: location
            })
        }
        return createRoute(null, {
            path: location
        })
    }
    return {
        match,
        addRoutes
    }
}
