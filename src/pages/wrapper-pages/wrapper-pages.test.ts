import { describe, expect, it } from 'vitest';
import WrapperPages from './wrapper-pages';
import Router from '@router/router';
import { RouterPages } from '@app/app';

describe('Wrapper page component', (): void => {
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
  it('wrapperPage instance of WrapperPages class', (): void => {
    expect(wrapperPage).toBeInstanceOf(WrapperPages);
  });

  it('check that the class instance is not empty', (): void => {
    expect(wrapperPage).toBeTruthy();
  });
});
