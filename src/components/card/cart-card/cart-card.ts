import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './cart-card.module.scss';
import Image from '@components/image/image';
import { Cart, ClientResponse, DiscountedPrice, LineItem } from '@commercetools/platform-sdk';
import { svgHtmlWasteBasket } from '@components/svg/waste-basket';
import { CounterControl } from '@components/card/cart-card/counter-control/counter-control';
import converterPrice from '@utils/converter-price.ts';
import { TypedMoney } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';
import { TotalPriceItem } from '@components/card/cart-card/price/total-price-item/total-price-item';
import CartApi from '@api/cartApi.ts';
import { apiInstance } from '@api/api.ts';
import { cartState, toastState } from '@state/state.ts';

export class CartCard extends View {
  totalPrice: TotalPriceItem;

  cartApi: CartApi;

  counterControl: CounterControl;

  constructor(lineItem: LineItem) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.card],
    };
    super(params);
    this.totalPrice = new TotalPriceItem();
    this.counterControl = new CounterControl((count: number) => this.handleChangeCount.apply(this, [count, lineItem]));
    this.cartApi = new CartApi(apiInstance);
    this.configureView(lineItem);
  }

  private configureView(lineItem: LineItem): void {
    const image: string | undefined = lineItem.variant.images?.[0].url;
    const price: TypedMoney | undefined = lineItem.price.value;
    const name: string = lineItem.name['en-US'];

    const card: HTMLElement = this.getElement();

    const productData: HTMLElement = new ElementCreator({ tag: 'div', classNames: [styles.productData] }).getElement();
    const controls: HTMLElement = new ElementCreator({ tag: 'div', classNames: [styles.controls] }).getElement();

    const titleProduct = new ElementCreator({ tag: 'div', classNames: [styles.titleProduct] }).getElement();

    if (image) {
      const photo: HTMLElement = new Image({ classNames: [styles.image], img: image }).getElement();
      titleProduct.append(photo);
    }

    const nameElement: HTMLElement = new ElementCreator({
      tag: 'span',
      classNames: [styles.name],
      textContent: name,
    }).getElement();

    titleProduct.append(nameElement);

    const buttonDelete: HTMLElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.buttonDelete],
    }).getElement();

    buttonDelete.innerHTML = svgHtmlWasteBasket;

    productData.append(titleProduct);

    if (price) {
      const priceValueElement = new ElementCreator({
        tag: 'span',
        classNames: [styles.discountValue],
      }).getElement();

      const priceElement: HTMLElement = new ElementCreator({
        tag: 'span',
        classNames: [styles.price],
        textContent: `Price: `,
      }).getElement();

      priceElement.append(priceValueElement);

      priceElement.append(` EUR`);

      const discounted: DiscountedPrice | undefined = lineItem.price.discounted;

      if (discounted) {
        priceValueElement.textContent = converterPrice(discounted.value);
        priceElement.append(` (discounted)`);
      } else {
        priceValueElement.textContent = converterPrice(price);
      }

      const valuePrice: number = (discounted ? discounted.value.centAmount : price.centAmount) * lineItem.quantity;

      const totalPrice: TypedMoney = { ...price, centAmount: valuePrice };

      this.totalPrice.setPrice(converterPrice(totalPrice));

      productData.append(priceElement);
    }

    this.counterControl.setValueCount(lineItem.quantity);

    const wrapperCounterPrice: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.wrapperCounterPrice],
      children: [this.counterControl.getElement(), this.totalPrice.getElement()],
    }).getElement();

    controls.append(wrapperCounterPrice, buttonDelete);

    card.append(productData, controls);
  }

  private handleChangeCount(count: number, lineItem: LineItem): void {
    const cart: ClientResponse<Cart> | null = cartState.getState().cart;

    if (!cart) return;
    this.counterControl.disable();

    this.cartApi
      .changeLineItemQuantity(cart.body.id, lineItem.id, count)
      .catch(() => {
        toastState.getState().toast.showError('Error');
      })
      .finally(() => {
        this.counterControl.undisable();
      });
  }
}
