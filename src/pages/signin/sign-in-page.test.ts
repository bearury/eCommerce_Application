import { describe, expect, it } from 'vitest';
import { SignInPage } from '@pages/index';

describe('Sign in page component', (): void => {
  const signInPage = new SignInPage();
  it('signInPage instance of SignInPage class', (): void => {
    expect(signInPage).toBeInstanceOf(SignInPage);
  });

  it('check that the class instance is not empty', (): void => {
    expect(signInPage).toBeTruthy();
  });
});
