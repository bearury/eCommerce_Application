import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { RouterPages } from '@app/app.ts';
import Toast from '@components/toast/toast';
import Loader from '@components/loader/loader';
import { ClientResponse, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';

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

interface DefaultAddressShipping {
  IsDefaultAddressShipping: boolean;
  setIsDefaultAddressShipping: (IsDefaultAddressShipping: boolean) => void;
}

interface DefaultAddressBilling {
  IsDefaultAddressBilling: boolean;
  setIsDefaultAddressBilling: (IsDefaultAddressBilling: boolean) => void;
}

const DefaultAddressShippingState = createStore(
  devtools<DefaultAddressShipping>((set) => ({
    IsDefaultAddressShipping: false,
    setIsDefaultAddressShipping: (IsDefaultAddressShipping: boolean) => set(() => ({ IsDefaultAddressShipping })),
  }))
);

const DefaultAddressBillingState = createStore(
  devtools<DefaultAddressBilling>((set) => ({
    IsDefaultAddressBilling: false,
    setIsDefaultAddressBilling: (IsDefaultAddressBilling: boolean) => set(() => ({ IsDefaultAddressBilling })),
  }))
);

interface ProductsDataState {
  data: ClientResponse<ProductProjectionPagedSearchResponse> | null;
  setData: (data: ClientResponse<ProductProjectionPagedSearchResponse>) => void;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
}

const productsDataState = createStore(
  devtools<ProductsDataState>((set) => ({
    data: null,
    currentPage: 1,
    setData: (data: ClientResponse<ProductProjectionPagedSearchResponse>) => set(() => ({ data })),
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

export {
  routerState,
  toastState,
  loaderState,
  authState,
  filterState,
  productsDataState,
  DefaultAddressShippingState,
  DefaultAddressBillingState,
};
