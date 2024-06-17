import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './basket-page.module.scss';
import Router from '@router/router.ts';
import { cartState } from '@state/state.ts';
import { TotalPriceItem } from '@components/card/cart-card/price/total-price-item/total-price-item';
import { Cart, ClientResponse, LineItem } from '@commercetools/platform-sdk';
import { CartCard } from '@components/card/cart-card/cart-card';
import { EmptyCart } from '@components/empty-cart/empty-cart';
import { PromocodeBlockBasket } from '@components/card/promocode-card/promocode-card_basket/promocode-card_basket';

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

    cartState.subscribe(this.configureView.bind(this));
  }

  private configureView(): void {
    const cart: ClientResponse<Cart> | null = cartState.getState().cart;

    if (!cart) return;
    const lineItem: LineItem[] = cart.body.lineItems;

    const basket: HTMLElement = this.getElement();

    basket.replaceChildren();

    const items: HTMLElement = new ElementCreator({ tag: 'div', classNames: [styles.items] }).getElement();

    const promocode = new PromocodeBlockBasket();

    const total = new TotalPriceItem();

    if (lineItem.length) {
      lineItem.forEach((item: LineItem) => {
        const itemCart: HTMLElement = new CartCard(item).getElement();
        items.append(itemCart);
      });
      basket.append(items, promocode.getElement(), total.getElement());
    } else {
      const emptyCart: EmptyCart = new EmptyCart(this.router);
      basket.append(emptyCart.getElement());
    }
  }
}
