import { parserHTML } from "./parser";
function genProps(attrs) {
  let str = "";
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === "style") {
      let styles = {};
      attr.value.split(";").forEach((item) => {
        let [key, value] = item.split(":");
        styles[key] = value;
      });
      attr.value = styles;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}
function genChildren(children) {
  if (children) {
    return children.map((child) => gen(child)).join(",");
  }
}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //匹配到的内容就是我们表达式的变量

function gen(node) {
  if (node.type == 1) {
    return codegen(node);
  } else {
    const text = node.text;
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`;
    } else {
      let tokens = [];
      let match;
      defaultTagRE.lastIndex = 0;
      let lastIndex = 0;
      while ((match = defaultTagRE.exec(text))) {
        let index = match.index;
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      console.log(tokens);
      return `_v(${tokens.join("+")})`;
    }
  }
}
function codegen(ast) {
  console.log(ast, "ast");
  const children = genChildren(ast.children);
  let code = `_c('${ast.tag}',${
    ast.attrs.length > 0 ? genProps(ast.attrs) : "null"
  }${ast.children.length ? `,${children}` : ""})`;
  return code;
}
export function compileToFunction(template) {
  //   console.log(template, "template");
  //第一步 将template 转化成ast语法树
  let ast = parserHTML(template);
  console.log(ast, "ast");
  //第二步 生成render方法(render方法执行后的返回结果就是虚拟DOM)
  console.log(codegen(ast));
}
