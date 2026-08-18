const ncname = `[a-zA-z_][\\-\\.0-9_a-zA-Z]*`; //匹配标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则， 捕获的内容是标签名
// console.log(startTagOpen); //regexper.com 可以解释正则的含义

const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>']+)))?/; // 属性匹配
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //匹配到的内容就是我们表达式的变量
//vue3采用的不是正则
export function parserHTML(html) {
  //parserHTML 最终需要转化成一颗抽象语法树，但是怎么确定父子关系？
  //构建树的原理是 通过构建一个栈，遇到开始标签一直往栈添加，直到遇到结束标签就删除最后一个
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3;
  const stack = []; //存放元素的栈
  let currentParent; //指向栈中的最后一个
  let root = null; //标记是否存在根节点
  function createASTElement(tag, attrs,parent=null) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs:attrs,
      parent
    };
  }
  //处理开始标签
  function start(tagName, attrs) {
    let node = createASTElement(tagName, attrs);
    if (!root) root = node;
    if (currentParent) {
      node.parent = currentParent;
      currentParent.children.push(node);
    }
    stack.push(node);
    currentParent = node;
  }
  function end(tagName) {
    console.log("end", tagName);
    stack.pop();
    currentParent = stack[stack.length - 1];
  }
  function chars(text) {
    text = text.replace(/\s/g, "");

    text &&
      currentParent.children.push({
        type: TEXT_TYPE,
        text,
        parent: currentParent,
      });
  }
  function advance(n) {
    html = html.substring(n);
  }
  function parserStartTag() {
    const start = html.match(startTagOpen);
    // console.log(start, "start"); //输出：['<div', 'div', index: 0, input: '<div id="app">\n <div style="color: red;">{{name}}</div>\n <span>{{age}}</span>\n </div>', groups: undefined]
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };
      //每次匹配完删除掉就是往前进
      advance(start[0].length);

      let attr, end;
      //匹配属性原理;如果不是开始标签的结束就一直匹配 ,匹配到的内容给attr
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
      }
      //这个end 指的是开始标签">" 左尖角号
      if (end) {
        advance(end[0].length);
      }
      return match;
    }
  }
  //html最开始肯定是一个"<"
  //解析原理：每解析一个就删除掉，等到字符串都删除完就解析完了
  while (html) {
    let index = html.indexOf("<"); //如果index索引是0则说明是个开始标签或者是结束标签，大于0说明是文本位置
    if (index == 0) {
      const startTagMatch = parserStartTag();
      if (startTagMatch) {
        // 一直从外层标签解析
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      //遇到结束标签"</>"
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);

        continue;
      }
      break;
    }

    if (index > 0) {
      let text = html.substring(0, index);
      // let chars = html.substring(0, index)
      if (text) {
        chars(text);
        advance(text.length);
      }
      // console.log(text)
      // break
    }
  }
  return root;
}
