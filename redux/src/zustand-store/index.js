import create from "../zustand/react";
import { logger } from "../zustand/middleware/logger";
const createState = (set,get,api) => {
  return {
    count: 0,
    add: () => set((state) => ({ count: state.count + 1 })),
    asyncAdd: () => {
      setTimeout(() => {
        set((state) => ({ count: state.count + 1 }));
      }, 1000);
    },
    minus: () => set((state) => ({ count: state.count - 1 })),
  };
};
export const useCouterStore = create(logger(createState));
