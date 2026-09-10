import { pathToRegexp } from "path-to-regexp";
//把路径转换成正则表达式
function compilePath(path, options) {
  let keys = [];
  let {regexp} = pathToRegexp(path, keys, options);
  return { keys, regexp };
}
//计算路径是否匹配
// pathname 当前地址栏中的路径
// sensitive 是否大小敏感
function matchPath(pathname, options = {}) {
  let {
    path = "/",
    exact = false,
    strict = false,
    sensitive = false,
  } = options;
  let { keys, regexp } = compilePath(path, { end: exact, strict, sensitive });
  const match = regexp.exec(pathname);
  if (!match) return null;
  const [url, ...values] = match;
  const isExact = pathname === url;
  if (exact && !isExact) return null;
  return {
    path,
    url, //Route路径转成的正则表达式
    isExact, //是否精确匹配
    params: keys.reduce((memo, key, index) => {
      memo[key.name] = values[index];
      return memo;   // ← 必须返回累加器
    }, {}),
  };
}
export default matchPath;
