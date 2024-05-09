import { describe, expect, it } from 'vitest';
import HeaderPages from '@components/header-pages/header-pages';
import Router from '../../router/router';
import WrapperPages from '../../pages/wrapper-pages/wrapper-pages';
import { RouterPages } from '../../app/app';

describe('Header pages component', (): void => {
  function getRouter(wrapperPage: WrapperPages) {
    return new Router([
      {
        path: '',
        callback: async (): Promise<void> => {
          const { SignUpPage } = await import('@pages/index');
          wrapperPage.setContent(new SignUpPage());
        },
      },
      {
        path: `${RouterPages.signup}`,
        callback: async (): Promise<void> => {
          const { SignUpPage } = await import('@pages/index');
          wrapperPage.setContent(new SignUpPage());
        },
      },
      {
        path: `${RouterPages.signin}`,
        callback: async (): Promise<void> => {
          const { SignInPage } = await import('@pages/index');
          wrapperPage.setContent(new SignInPage());
        },
      },
      {
        path: `${RouterPages.main}`,
        callback: async (): Promise<void> => {
          const { MainPage } = await import('@pages/index');
          wrapperPage.setContent(new MainPage());
        },
      },
    ]);
  }

  const wrapperPage: WrapperPages = new WrapperPages(
    new Router([
      {
        path: '',
        callback: async (): Promise<void> => {
          const { SignUpPage } = await import('@pages/index');
          wrapperPage.setContent(new SignUpPage());
        },
      },
      {
        path: `${RouterPages.signup}`,
        callback: async (): Promise<void> => {
          const { SignUpPage } = await import('@pages/index');
          wrapperPage.setContent(new SignUpPage());
        },
      },
      {
        path: `${RouterPages.signin}`,
        callback: async (): Promise<void> => {
          const { SignInPage } = await import('@pages/index');
          wrapperPage.setContent(new SignInPage());
        },
      },
      {
        path: `${RouterPages.main}`,
        callback: async (): Promise<void> => {
          const { MainPage } = await import('@pages/index');
          wrapperPage.setContent(new MainPage());
        },
      },
    ])
  );

  const headerPages = new HeaderPages(getRouter(wrapperPage));
  it('Header pages instance of HeaderPages class', (): void => {
    expect(headerPages).toBeInstanceOf(HeaderPages);
  });

  it('check that the class instance is not empty', (): void => {
    expect(headerPages).toBeTruthy();
  });
});
