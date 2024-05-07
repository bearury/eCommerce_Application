import { describe, expect, it } from 'vitest';
import { MainPage } from '@pages/index';

describe('Main page component', () => {
  const mainPage = new MainPage();
  it('mainPage instance of MainPage class', () => {
    expect(mainPage).toBeInstanceOf(MainPage);
  });

  it('check that the class instance is not empty', () => {
    expect(mainPage).toBeTruthy();
  });
});
