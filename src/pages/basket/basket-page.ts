import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './basket-page.module.scss';
import Router from '@router/router.ts';
import { cartState } from '@state/state.ts';
import { TotalPriceItem } from '@components/card/cart-card/price/total-price-item/total-price-item';
import { Cart, CentPrecisionMoney, ClientResponse, LineItem } from '@commercetools/platform-sdk';
import { CartCard } from '@components/card/cart-card/cart-card';
import { EmptyCart } from '@components/empty-cart/empty-cart';
import converterPrice from '@utils/converter-price.ts';
import CartApi from '@api/cartApi';
import { apiInstance } from '@api/api';

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
    const totalPrice: CentPrecisionMoney | undefined = cart?.body.totalPrice;

    if (!cart) return;
    const lineItem: LineItem[] = cart.body.lineItems;

    const basket: HTMLElement = this.getElement();

    basket.replaceChildren();

    const items: HTMLElement = new ElementCreator({ tag: 'div', classNames: [styles.items] }).getElement();

    const total: TotalPriceItem = new TotalPriceItem();

    const wrapperTotalPriceElement: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.wrapperTotalPrice],
      children: [total.getElement()],
    }).getElement();

    if (totalPrice) {
      total.setPrice(converterPrice(totalPrice));
    }

    if (lineItem.length) {
      lineItem.forEach((item: LineItem) => {
        const itemCart: HTMLElement = new CartCard(item, this.deleteFromCart.bind(this)).getElement();
        items.append(itemCart);
      });
      basket.append(items, wrapperTotalPriceElement);
    } else {
      const emptyCart: EmptyCart = new EmptyCart(this.router);
      basket.append(emptyCart.getElement());
    }
  }

  private async deleteFromCart(item: LineItem, card: HTMLElement) {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      throw new Error('No cart id!');
    }
    const response = await new CartApi(apiInstance).deleteFromCart(cartId, item.id);
    if (response && response.statusCode === 200) {
      card.remove();
    }
  }
}
