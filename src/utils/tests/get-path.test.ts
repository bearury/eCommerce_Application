import { describe, expect, it } from 'vitest';
import { RouterPages } from '@app/app';
import getPath from '@utils/get-path';

describe('get path function', (): void => {
  const resultMain = getPath('main');
  const resultSignIn = getPath('signin');
  const resultSignUp = getPath('signup');
  const resultUndefined = getPath('test');

  it('should by return correct path', (): void => {
    expect(resultMain).toBe(RouterPages.main);
  });

  it('should by return correct path', (): void => {
    expect(resultSignIn).toBe(RouterPages.signin);
  });

  it('should by return correct path', (): void => {
    expect(resultSignUp).toBe(RouterPages.signup);
  });

  it('should by return null', (): void => {
    expect(resultUndefined).toBeNull();
  });
});
