import { describe, expect, it } from 'vitest';
import { MainPage } from '@pages/index';
import Router from '@router/router.ts';

describe('Main page component', (): void => {
  const router = new Router([
    {
      path: '',
      callback: async (): Promise<void> => {},
    },
  ]);
  const mainPage = new MainPage(router);
  it('mainPage instance of MainPage class', (): void => {
    expect(mainPage).toBeInstanceOf(MainPage);
  });

  it('check that the class instance is not empty', (): void => {
    expect(mainPage).toBeTruthy();
  });
});
