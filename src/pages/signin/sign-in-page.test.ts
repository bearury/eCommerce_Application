import { describe, expect, it } from 'vitest';
import { SignInPage } from '@pages/index';

describe('Sign in page component', () => {
  const signInPage = new SignInPage();
  it('signInPage instance of SignInPage class', () => {
    expect(signInPage).toBeInstanceOf(SignInPage);
  });

  it('check that the class instance is not empty', () => {
    expect(signInPage).toBeTruthy();
  });
});
