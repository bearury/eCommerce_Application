import { describe, expect, it } from 'vitest';
import HeaderPages from '@components/header-pages/header-pages';
import Router from '../../router/router';

describe('Header pages component', (): void => {
  const router = new Router([
    {
      path: '',
      callback: async (): Promise<void> => {},
    },
  ]);

  const headerPages = new HeaderPages(router);
  it('Header pages instance of HeaderPages class', (): void => {
    expect(headerPages).toBeInstanceOf(HeaderPages);
  });

  it('check that the class instance is not empty', (): void => {
    expect(headerPages).toBeTruthy();
  });
});
