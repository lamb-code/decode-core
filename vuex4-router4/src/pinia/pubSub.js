export function addSubcription(subscriptions, cb) {
  subscriptions.push(cb);
  return function removeSubscription(cb) {
    const idx = subscriptions.indexof(cb);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
    }
  };
}
export function triggerSubscription(subscriptions, ...args) {
  subscriptions.forEach((cb) => {
    cb(...args);
  });
}
