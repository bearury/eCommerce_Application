import View from '../utils/view';
import Router, { Route } from '../router/router';
import WrapperPages from '@pages/wrapper-pages/wrapper-pages';
import Toast from '@components/toast/toast';
import { loaderState, toastState } from '@state/state.ts';
import Loader from '@components/loader/loader';
import { session } from '@api/api';
import { ApiRoot } from '@commercetools/platform-sdk';

export enum RouterPages {
  signup = 'signup',
  signin = 'signin',
  not_found = 'not_found',
  main = 'main',
}

export default class App {
  wrapperPage: WrapperPages;

  body: HTMLBodyElement;

  router: Router;

  toast: Toast;

  loader: Loader;

  session: ApiRoot;

  constructor() {
    this.router = new Router(this.createRoutes());
    this.wrapperPage = new WrapperPages(this.router);
    this.body = document.querySelector('body') as HTMLBodyElement;
    this.toast = toastState.getState().toast;
    this.loader = loaderState.getState().loader;
    this.session = session;
  }

  public start(): void {
    this.body.append(this.wrapperPage.getElement(), this.toast.getElement(), this.loader.getElement());
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
          this.setContent(RouterPages.main, new MainPage());
        },
      },
      {
        path: `${RouterPages.not_found}`,
        callback: async (): Promise<void> => {
          const { NotFoundPage } = await import('@pages/index');
          this.setContent(RouterPages.not_found, new NotFoundPage());
        },
      },
    ];
  }
}
