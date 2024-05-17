import { describe, expect, it } from 'vitest';
import NotFoundPage from '@pages/not-found/not-found-page.ts';

describe('Not-found page component', (): void => {
  const notFoundPage = new NotFoundPage();
  it('notFoundPage instance of NotFoundPage class', (): void => {
    expect(notFoundPage).toBeInstanceOf(NotFoundPage);
  });

  it('check that the class instance is not empty', (): void => {
    expect(notFoundPage).toBeTruthy();
  });
});
