import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { RouterPages } from '@app/app.ts';

interface RouterState {
  page: RouterPages | null;
  setPage: (page: RouterPages) => void;
}

const routerState = createStore(
  devtools<RouterState>((set) => ({
    page: null,
    setPage: (page: RouterPages) => set(() => ({ page })),
  }))
);

export { routerState };
