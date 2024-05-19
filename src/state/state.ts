import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { RouterPages } from '@app/app.ts';
import Toast from '@components/toast/toast';
import Loader from '@components/loader/loader';

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

interface ToastState {
  toast: Toast;
}

const toastState = createStore(
  devtools<ToastState>(() => ({
    toast: new Toast(),
  }))
);

const loaderState = createStore(
  devtools<{ loader: Loader }>(() => ({
    loader: new Loader(),
  }))
);

interface AuthState {
  isAuthorized: boolean;
  setIsAuthorized: (isAuthorized: boolean) => void;
}

const authState = createStore(
  devtools<AuthState>((set) => ({
    isAuthorized: false,
    setIsAuthorized: (isAuthorized: boolean) => set(() => ({ isAuthorized })),
  }))
);
export { routerState, toastState, loaderState, authState };
