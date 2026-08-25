export const SymbolPinia = Symbol();
export let activedPinia;
export const setActivePinia = (pinia) => {
  activedPinia = pinia;
};
