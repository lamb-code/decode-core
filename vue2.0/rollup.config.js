import babel from "rollup-plugin-babel";
import resolve from '@rollup/plugin-node-resolve'
export default {
  input: "./src/index.js", //打包入口文件
  output: {
    file: "dist/umd/vue.js", //打包出口文件
    name: "Vue", //会在global 添加 Vue属性 global.vue
    format: "umd", //打包格式umd,常见格式 esm es6模块 commonjs 模块
    sourcemap: true, //希望可以调试源代码
  },
  plugins: [
    resolve(),

    // babel 默认会取.babelrc 配置项
    babel({
      exclude: "node_modules/**", // glob写法，去掉依赖库下的所有文件夹下的文件
    }),
  ],
};
// 为什么Vue2 只能支持IE9.0以上，原因是Object.defineProperty不支持低版本的