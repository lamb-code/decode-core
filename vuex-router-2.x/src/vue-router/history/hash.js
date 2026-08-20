/* eslint-disable */
import History from "./base";
function getHash() {
  return window.location.hash.slice(1);
}
function ensureSlash() {
  if (window.location.hash) return;
  window.location.hash = "/";
}
export default class HashHistory extends History {
  constructor(router) {
    //router 指的就是 new VueRouter
    super(router);
    // this.router =router
    //如果使用hash模式 默认如果没有hash 应该跳转到#/
    ensureSlash();
  }
  getCurrentLocation() {
    return getHash();
  }
  setupListener() {
    window.addEventListener("hashchange", () => {
      this.transitionTo(getHash());
    });
  }
}
