import View from '../utils/view';
import Router, { Route } from '../router/router';
import WrapperPages from '@pages/wrapper-pages/wrapper-pages';
import { loaderState } from '@state/state.ts';
import Loader from '@components/loader/loader';
import CartApi from '@api/cartApi.ts';
import { apiInstance } from '@api/api';

export enum RouterPages {
  main = 'main',
  products = 'products',
  product = 'product',
  basket = 'basket',
  profile = 'profile',
  signup = 'signup',
  signin = 'signin',
  about = 'about',
  not_found = 'not_found',
}

export default class App {
  wrapperPage: WrapperPages;

  body: HTMLBodyElement;

  router: Router;

  loader: Loader;

  constructor() {
    this.router = new Router(this.createRoutes());
    this.wrapperPage = new WrapperPages(this.router);
    this.body = document.querySelector('body') as HTMLBodyElement;
    this.loader = loaderState.getState().loader;
    if (!localStorage.getItem('cartId')) new CartApi(apiInstance).createAnonymousCart();
  }

  public start(): void {
    this.body.append(this.wrapperPage.getElement(), this.loader.getElement());
  }

  private setContent(pageName: RouterPages, view: View): void {
    if (pageName) {
      this.wrapperPage.setContent(view);
    }
  }

  private createRoutes(): Array<Route> {
    return [
      {
        path: '',
        callback: async (): Promise<void> => {
          const { SignUpPage } = await import('@pages/index');
          this.setContent(RouterPages.signup, new SignUpPage(this.router));
        },
      },
      {
        path: `${RouterPages.signup}`,
        callback: async (): Promise<void> => {
          const { SignUpPage } = await import('@pages/index');
          this.setContent(RouterPages.signup, new SignUpPage(this.router));
        },
      },
      {
        path: `${RouterPages.signin}`,
        callback: async (): Promise<void> => {
          const { SignInPage } = await import('@pages/index');
          this.setContent(RouterPages.signin, new SignInPage(this.router));
        },
      },
      {
        path: `${RouterPages.main}`,
        callback: async (): Promise<void> => {
          const { MainPage } = await import('@pages/index');
          this.setContent(RouterPages.main, new MainPage(this.router));
        },
      },
      {
        path: `${RouterPages.products}`,
        callback: async (): Promise<void> => {
          const { ProductsPage } = await import('@pages/index');
          this.setContent(RouterPages.products, new ProductsPage(this.router));
        },
      },
      {
        path: `${RouterPages.basket}`,
        callback: async (): Promise<void> => {
          const { BasketPage } = await import('@pages/index');
          this.setContent(RouterPages.basket, new BasketPage(this.router));
        },
      },
      {
        path: `${RouterPages.product}/{id}`,
        callback: async (resource: string): Promise<void> => {
          const { CardProductPage } = await import('@pages/index');
          this.setContent(RouterPages.product, new CardProductPage(resource, this.router));
        },
      },
      {
        path: `${RouterPages.profile}`,
        callback: async (): Promise<void> => {
          const { ProfilePage } = await import('@pages/index');
          this.setContent(RouterPages.profile, new ProfilePage());
        },
      },
      {
        path: `${RouterPages.about}`,
        callback: async (): Promise<void> => {
          const { AboutPage } = await import('@pages/index');
          this.setContent(RouterPages.about, new AboutPage(this.router));
        },
      },
      {
        path: `${RouterPages.not_found}`,
        callback: async (): Promise<void> => {
          const { NotFoundPage } = await import('@pages/index');
          this.setContent(RouterPages.not_found, new NotFoundPage(this.router));
        },
      },
    ];
  }
}
