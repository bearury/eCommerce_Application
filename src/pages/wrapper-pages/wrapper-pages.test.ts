import { describe, expect, it } from 'vitest';
import WrapperPages from './wrapper-pages';
import Router from '@router/router';

describe('Wrapper page component', (): void => {
  const wrapperPage: WrapperPages = new WrapperPages(
    new Router([
      {
        path: '',
        callback: async (): Promise<void> => {},
      },
    ])
  );
  it('wrapperPage instance of WrapperPages class', (): void => {
    expect(wrapperPage).toBeInstanceOf(WrapperPages);
  });

  it('check that the class instance is not empty', (): void => {
    expect(wrapperPage).toBeTruthy();
  });
});
