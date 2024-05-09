import { describe, expect, it } from 'vitest';
import { SignUpPage } from '@pages/index';

describe('Sign in page component', (): void => {
  const signInPage = new SignUpPage();
  it('signUpPage instance of SignUpPage class', (): void => {
    expect(signInPage).toBeInstanceOf(SignUpPage);
  });

  it('check that the class instance is not empty', (): void => {
    expect(signInPage).toBeTruthy();
  });
});
