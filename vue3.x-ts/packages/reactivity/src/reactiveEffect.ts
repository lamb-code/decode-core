import { activeEffect } from "./effect";

export function track(target,key){
//  activeEffect 有值 说明这个key是在effect中访问的，没有则说明是在effect之外访问的
if(activeEffect){

}
}