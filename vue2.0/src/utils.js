const strats = {};
const LIFECYCLE = ["beforeCreate", "created", "beforeMount", "mounted"];
LIFECYCLE.forEach((hook) => {
  strats[hook] = function (p, c) {
    if (c) {
      if (p) {
        return p.concat(c);
      } else {
        return [c];
      }
    } else {
      return p;
    }
  };
});
strats.components = function (parentVal, childVal) {
  let res = Object.create(parentVal);
  if (childVal) {
    for (let key in childVal) {
      res[key] = childVal[key];
    }
  }
};
export function mergeOptions(parent, child) {
  const options = { ...parent, ...child };
  for (let key in parent) {
    mergeField(key);
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key]);
    } else {
      options[key] = child[key] || parent[key];
    }
  }
  return options;
}
