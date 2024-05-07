import { describe, expect, it } from 'vitest';
import WrapperPages from './wrapper-pages.ts';

describe('Wrapper page component', () => {
  const wrapperPage = new WrapperPages();
  it('wrapperPage instance of WrapperPages class', () => {
    expect(wrapperPage).toBeInstanceOf(WrapperPages);
  });

  it('check that the class instance is not empty', () => {
    expect(wrapperPage).toBeTruthy();
  });
});
