export function logger(createState) {
  return (set, get, api) => {
    console.log(set,get,api,'ddd')
    return createState(
      (...args) => {
        console.log("老状态", get());
        set(...args);
        console.log("新状态", get());
      },
      get,
      api
    );
  };
}
