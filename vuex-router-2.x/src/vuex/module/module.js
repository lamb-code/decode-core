/* eslint-disable */

import { forEachValue } from "../util";

export default class Module {
  constructor(rootModule) {
    this._rawModule = rootModule;
    this._children = {};
    this.state = rootModule.state;
  }
  getChild(key) {
    return this._children[key];
  }
  addChild(key, value) {
    this._children[key] = value;
  }
  forEachMutation(fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn);
    }
  }
  forEachAction(fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn);
    }
  }
  forEachGetter(fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn);
    }
  }
  forEachChild(fn) {
    forEachValue(this._children, fn);
  }
}
