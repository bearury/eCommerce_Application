import View from '../utils/view';
import Router, { Route } from '../router/router';
import WrapperPages from '@pages/wrapper-pages/wrapper-pages';

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

  constructor() {
    this.router = new Router(this.createRoutes());
    this.wrapperPage = new WrapperPages(this.router);
    this.body = document.querySelector('body') as HTMLBodyElement;
  }

  public start(): void {
    this.body.append(this.wrapperPage.getElement());
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
          this.setContent(RouterPages.signup, new SignUpPage());
        },
      },
      {
        path: `${RouterPages.signup}`,
        callback: async (): Promise<void> => {
          const { SignUpPage } = await import('@pages/index');
          this.setContent(RouterPages.signup, new SignUpPage());
        },
      },
      {
        path: `${RouterPages.signin}`,
        callback: async (): Promise<void> => {
          const { SignInPage } = await import('@pages/index');
          this.setContent(RouterPages.signin, new SignInPage());
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
