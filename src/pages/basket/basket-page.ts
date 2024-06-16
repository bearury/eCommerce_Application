import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './basket-page.module.scss';
import Router from '@router/router.ts';
import { cartState } from '@state/state.ts';
import { TotalPriceItem } from '@components/card/cart-card/price/total-price-item/total-price-item';
import { LineItem } from '@commercetools/platform-sdk';
import { CartCard } from '@components/card/cart-card/cart-card';
import { EmptyCart } from '@components/empty-cart/empty-cart';

export default class BasketPage extends View {
  router: Router;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
    };
    super(params);
    this.router = router;

    this.configureView();
  }

  private configureView(): void {
    const cart = cartState.getState().cart;

    if (!cart) return;
    const lineItem: LineItem[] = cart.body.lineItems;

    const about: HTMLElement = this.getElement();

    const items: HTMLElement = new ElementCreator({ tag: 'div', classNames: [styles.items] }).getElement();

    const total = new TotalPriceItem();

    if (lineItem.length) {
      lineItem.forEach((item: LineItem) => {
        const itemCart: HTMLElement = new CartCard(item).getElement();
        items.append(itemCart);
      });
      about.append(items, total.getElement());
    } else {
      const emptyCart: EmptyCart = new EmptyCart(this.router);
      about.append(emptyCart.getElement());
    }
  }
}
