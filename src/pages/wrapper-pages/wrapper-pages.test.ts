import { describe, expect, it } from 'vitest';
import WrapperPages from './wrapper-pages.ts';
import Router, { Route } from '@router/router.ts';
import { RouterPages } from '@app/app.ts';
import View from '@utils/view.ts';

function createRoutes(): Array<Route> {
  return [
    {
      path: '',
      callback: async (): Promise<void> => {
        const { SignUpPage } = await import('@pages/index');
        setContent(RouterPages.signup, new SignUpPage());
      },
    },
    {
      path: `${RouterPages.signup}`,
      callback: async (): Promise<void> => {
        const { SignUpPage } = await import('@pages/index');
        setContent(RouterPages.signup, new SignUpPage());
      },
    },
    {
      path: `${RouterPages.signin}`,
      callback: async (): Promise<void> => {
        const { SignInPage } = await import('@pages/index');
        setContent(RouterPages.signin, new SignInPage());
      },
    },
    {
      path: `${RouterPages.main}`,
      callback: async (): Promise<void> => {
        const { MainPage } = await import('@pages/index');
        setContent(RouterPages.main, new MainPage());
      },
    },
  ];
}

function setContent(pageName: RouterPages, view: View): void {
  if (pageName) {
    wrapperPage.setContent(view);
  }
}

export const testsRouter: Router = new Router(createRoutes());
const wrapperPage: WrapperPages = new WrapperPages(testsRouter);

describe('Wrapper page component', (): void => {
  it('wrapperPage instance of WrapperPages class', (): void => {
    expect(wrapperPage).toBeInstanceOf(WrapperPages);
  });

  it('check that the class instance is not empty', (): void => {
    expect(wrapperPage).toBeTruthy();
  });
});
