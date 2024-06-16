import { describe, expect, it } from 'vitest';
import Router from '@router/router.ts';
import BasketPage from '@pages/basket/basket-page';

describe('Basket page component', (): void => {
  const router = new Router([
    {
      path: '',
      callback: async (): Promise<void> => {},
    },
  ]);
  const basketPage = new BasketPage(router);
  it('basketPage instance of BasketPage class', (): void => {
    expect(basketPage).toBeInstanceOf(BasketPage);
  });

  it('check that the class instance is not empty', (): void => {
    expect(basketPage).toBeTruthy();
  });
});
