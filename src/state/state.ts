import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { RouterPages } from '@app/app.ts';
import Toast from '@components/toast/toast';
import Loader from '@components/loader/loader';
import { ClientResponse, ProductPagedQueryResponse } from '@commercetools/platform-sdk';

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

interface ProductsDataState {
  data: ClientResponse<ProductPagedQueryResponse> | null;
  setData: (data: ClientResponse<ProductPagedQueryResponse>) => void;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
}

const productsDataState = createStore(
  devtools<ProductsDataState>((set) => ({
    data: null,
    currentPage: 1,
    setData: (data: ClientResponse<ProductPagedQueryResponse>) => set(() => ({ data })),
    setCurrentPage: (currentPage: number) => set(() => ({ currentPage })),
  }))
);

interface FilterState {
  color: string | null;
  brand: string | null;
  wattage: number | null;
  setColor: (color: string) => void;
  setBrand: (brand: string) => void;
  setWattage: (wattage: number) => void;
}

const filterState = createStore(
  devtools<FilterState>((set) => ({
    color: null,
    brand: null,
    wattage: null,
    setColor: (color: string | null) => set(() => ({ color })),
    setBrand: (brand: string | null) => set(() => ({ brand })),
    setWattage: (wattage: number | null) => set(() => ({ wattage })),
  }))
);

export { routerState, toastState, loaderState, authState, filterState, productsDataState };
