import { nodeOps } from "./nodeOps";
import patchProp from "./patchProp";
import {createRenderer} from '@vue/runtime-core'
const renderOptions = Object.assign({ patchProp }, nodeOps);
export { renderOptions };
export const render = (vnode,container)=>{
    return createRenderer(renderOptions).render(vnode,container)
}
export * from "@vue/reactivity";
export * from "@vue/runtime-core";
// 包依赖关系
//runtime-dom=>依赖 runtime-core=>依赖reactivity