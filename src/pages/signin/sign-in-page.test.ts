import { describe, expect, it } from 'vitest';
import { SignInPage } from '@pages/index';
import Router from '@router/router.ts';

describe('Sign in page component', (): void => {
  const router = new Router([
    {
      path: '',
      callback: async (): Promise<void> => {},
    },
  ]);
  const signInPage = new SignInPage(router);
  it('signInPage instance of NotFoundPage class', (): void => {
    expect(signInPage).toBeInstanceOf(SignInPage);
  });

  it('check that the class instance is not empty', (): void => {
    expect(signInPage).toBeTruthy();
  });
});
