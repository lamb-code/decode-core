/* eslint-disable */
//createRouteMap具备新增和添加的功能
export default function createRouteMap(routes, oldPathList, oldPathMap) {
  let pathList = oldPathList || [];
  let pathMap = oldPathMap || Object.create(null);
  routes.forEach((route) => {
    addRouteRecord(route, pathList, pathMap);
  });
  return {
    pathList,
    pathMap,
  };
}
function addRouteRecord(route, pathList, pathMap, parent) {
  let path = parent ? `${parent.path}/${route.path}` : route.path;
  let record = {
    path,
    component: route.component,
    parent,
  };
  //先判断pathMap是否添加过，没有才会去添加，防止用户编写路由时有重复的
  if (!pathMap[path]) {
    pathList.push(path);
    pathMap[path] = record;
  }
  if (route.children) {
    route.children.forEach((child) => {
      //应该还需要判断子路由是否/开头
      addRouteRecord(child, pathList, pathMap, record);
    });
  }
}
