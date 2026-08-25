export function mapState(useStore, keysOrMap) {
  return Array.isArray(keysOrMap)
    ? keysOrMap.reduce((reduced, key) => {
        reduced[key] = function () {
          return useStore()[key];
        };
        return reduced;
      }, {})
    : Object.keys(keysOrMap).reduce((reduced, key) => {
        reduced[key] = function () {
          const store = useStore();
          const storeKey = keysOrMap[key];
          return store[storeKey];
        };
        return reduced;
      }, {});
}
export function mapActions(useStore, keysOrMap) {
  return Array.isArray(keysOrMap)
    ? keysOrMap.reduce((reduced, key) => {
        reduced[key] = function (...args) {
          return useStore()[key](...args);
        };
        return reduced;
      }, {})
    : Object.keys(keysOrMap).reduce((reduced, key) => {
        reduced[key] = function () {
          const store = useStore();
          const storeKey = keysOrMap[key];
          return store[storeKey](...args);
        };
        return reduced;
      }, {});
}
export function mapWritableState(useStore, keysOrMap) {
  return Array.isArray(keysOrMap)
    ? keysOrMap.reduce((reduced, key) => {
        reduced[key] = {
          get() {
            return useStore()[key];
          },
          set(value) {
            useStore()[key] = value;
          },
        };
        return reduced;
      }, {})
    : Object.keys(keysOrMap).reduce((reduced, key) => {
        reduced[key] = {
          get() {
            const store = useStore();
            const storeKey = keysOrMap[key];
            return store[storeKey];
          },
          set(value) {
            const store = useStore();
            const storeKey = keysOrMap[key];
            store[storeKey] = value;
          },
        };
        return reduced;
      }, {});
}
