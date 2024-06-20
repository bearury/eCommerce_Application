import { describe, expect, it } from 'vitest';
import Router from '@router/router.ts';
import AboutPage from '@pages/about/about-page';

describe('About page component', (): void => {
  const router = new Router([
    {
      path: '',
      callback: async (): Promise<void> => {},
    },
  ]);
  const aboutPage = new AboutPage(router);
  it('aboutPage instance of AboutPage class', (): void => {
    expect(aboutPage).toBeInstanceOf(AboutPage);
  });

  it('check that the class instance is not empty', (): void => {
    expect(aboutPage).toBeTruthy();
  });
});
