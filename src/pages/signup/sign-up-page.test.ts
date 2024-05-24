import { describe, expect, it } from 'vitest';
import { SignUpPage } from '@pages/index';
import Router from '@router/router.ts';

describe('Sign in page component', (): void => {
  const router = new Router([
    {
      path: '',
      callback: async (): Promise<void> => {},
    },
  ]);
  const signInPage = new SignUpPage(router);
  it('signUpPage instance of SignUpPage class', (): void => {
    expect(signInPage).toBeInstanceOf(SignUpPage);
  });

  it('check that the class instance is not empty', (): void => {
    expect(signInPage).toBeTruthy();
  });
});
