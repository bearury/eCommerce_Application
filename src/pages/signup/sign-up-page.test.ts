import { describe, expect, it } from 'vitest';
import { SignUpPage } from '@pages/index';

describe('Sign in page component', () => {
  const signInPage = new SignUpPage();
  it('signUpPage instance of SignUpPage class', () => {
    expect(signInPage).toBeInstanceOf(SignUpPage);
  });

  it('check that the class instance is not empty', () => {
    expect(signInPage).toBeTruthy();
  });
});
