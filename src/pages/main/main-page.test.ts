import { describe, expect, it } from 'vitest';
import { MainPage } from '@pages/index';

describe('Main page component', (): void => {
  const mainPage = new MainPage();
  it('mainPage instance of MainPage class', (): void => {
    expect(mainPage).toBeInstanceOf(MainPage);
  });

  it('check that the class instance is not empty', (): void => {
    expect(mainPage).toBeTruthy();
  });
});
