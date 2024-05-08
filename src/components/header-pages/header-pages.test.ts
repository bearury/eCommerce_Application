import { describe, expect, it } from 'vitest';
import HeaderPages from '@components/header-pages/header-pages.ts';
import { testsRouter } from '@pages/wrapper-pages/wrapper-pages.test.ts';

describe('Header pages component', (): void => {
  const headerPages = new HeaderPages(testsRouter);
  it('Header pages instance of HeaderPages class', (): void => {
    expect(headerPages).toBeInstanceOf(HeaderPages);
  });

  it('check that the class instance is not empty', (): void => {
    expect(headerPages).toBeTruthy();
  });
});
