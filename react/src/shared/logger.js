import * as ReactWorkTags from "react-reconciler/src/ReactWorkTags";
const ReactWorkTagsMap = new Map();
for (let tag in ReactWorkTags) {
  ReactWorkTagsMap.set(ReactWorkTags[tag], tag);
}
export default function (prefix, workInProgress) {
    console.log(workInProgress.tag)
  let tagValue = workInProgress.tag;
  let tagName = ReactWorkTagsMap.get(tagValue);
  console.log(tagName,'tagName')
  let str = ` ${tagName} `;
  if (tagName === "hostCompoent") {
    str + ` ${workInProgress.type} `;
  }else if(tagName==='HostText'){
    str +` ${workInProgress.pendingProps} `;
  }
  console.log(`${prefix} ${str}`)
}
