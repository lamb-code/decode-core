const routes = [
//   {
//     path: "/",
//     element: "Home",
//   },
  {
    path: "/user",
    element: "User",
    children: [
      {
        path: "add",
        element: "UserAdd",
      },
      {
        path: "list",
        element: "UserList",
      },
      {
        path: "detail/:id",
        element: "UserDetail",
      },
    ],
  },
];
function joinPaths(paths){
    //替换斜杠 如 ['/user','/add'] 替换成 /user//add =>/user/add
    return paths.join('/').replace(/\/\/+/g,'/')
}
function flattenRoutes(
  routes,
  branches = [],
  parentsMeta = [],
  parentPath = ""
) {
  routes.forEach((route, index) => {
    //定义一个路由匹配的元数据：一个路由匹配一个meta
    let routeMeta = {
      route,
      relativePath:route.path
    };
    let path = joinPaths([parentPath,routeMeta.relativePath])
    //把父亲的路由meta数组加上自己的meta数组变成一个新数组
    let routesMeta= parentsMeta.concat(routeMeta)
    if(route.children&&route.children.length>0){
        flattenRoutes(route.children,branches,routesMeta,path)
    }
    branches.push({
        path,
        routesMeta
    })
  });
  return branches
}

const branches = flattenRoutes(routes);
console.log(JSON.stringify(branches,null,2))
const list =[
    {
      "path": "/user/add",
      "routesMeta": [
        {
          "route": {
            "path": "/user",
            "element": "User",
            "children": [
              {
                "path": "add",
                "element": "UserAdd"
              },
              {
                "path": "list",
                "element": "UserList"
              },
              {
                "path": "detail/:id",
                "element": "UserDetail"
              }
            ]
          },
          "relativePath": "/user"
        },
        {
          "route": {
            "path": "add",
            "element": "UserAdd"
          },
          "relativePath": "add"
        }
      ]
    },
    {
      "path": "/user/list",
      "routesMeta": [
        {
          "route": {
            "path": "/user",
            "element": "User",
            "children": [
              {
                "path": "add",
                "element": "UserAdd"
              },
              {
                "path": "list",
                "element": "UserList"
              },
              {
                "path": "detail/:id",
                "element": "UserDetail"
              }
            ]
          },
          "relativePath": "/user"
        },
        {
          "route": {
            "path": "list",
            "element": "UserList"
          },
          "relativePath": "list"
        }
      ]
    },
    {
      "path": "/user/detail/:id",
      "routesMeta": [
        {
          "route": {
            "path": "/user",
            "element": "User",
            "children": [
              {
                "path": "add",
                "element": "UserAdd"
              },
              {
                "path": "list",
                "element": "UserList"
              },
              {
                "path": "detail/:id",
                "element": "UserDetail"
              }
            ]
          },
          "relativePath": "/user"
        },
        {
          "route": {
            "path": "detail/:id",
            "element": "UserDetail"
          },
          "relativePath": "detail/:id"
        }
      ]
    },
    {
      "path": "/user",
      "routesMeta": [
        {
          "route": {
            "path": "/user",
            "element": "User",
            "children": [
              {
                "path": "add",
                "element": "UserAdd"
              },
              {
                "path": "list",
                "element": "UserList"
              },
              {
                "path": "detail/:id",
                "element": "UserDetail"
              }
            ]
          },
          "relativePath": "/user"
        }
      ]
    }
  ]