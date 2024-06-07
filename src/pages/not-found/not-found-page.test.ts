import { describe, expect, it } from 'vitest';
import NotFoundPage from '@pages/not-found/not-found-page';
import Router from '@router/router.ts';

describe('Not-found page component', (): void => {
  const router = new Router([
    {
      path: '',
      callback: async (): Promise<void> => {},
    },
  ]);
  const notFoundPage = new NotFoundPage(router);
  it('notFoundPage instance of NotFoundPage class', (): void => {
    expect(notFoundPage).toBeInstanceOf(NotFoundPage);
  });

  it('check that the class instance is not empty', (): void => {
    expect(notFoundPage).toBeTruthy();
  });
});
