import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './cart-card.module.scss';
import Image from '@components/image/image';
import { LineItem } from '@commercetools/platform-sdk';
import { svgHtmlWasteBasket } from '@components/svg/waste-basket';
import { CounterControl } from '@components/card/cart-card/counter-control/counter-control';
import converterPrice from '@utils/converter-price.ts';
import { TypedMoney } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';
import { TotalPriceItem } from '@components/card/cart-card/price/total-price-item/total-price-item';

export class CartCard extends View {
  totalPrice: TotalPriceItem;

  constructor(lineItem: LineItem) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.card],
    };
    super(params);
    this.totalPrice = new TotalPriceItem();
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
      const priceElement: HTMLElement = new ElementCreator({
        tag: 'span',
        classNames: [styles.price],
        textContent: `Price: ${converterPrice(price)} USD`,
      }).getElement();

      this.totalPrice.setPrice(converterPrice(price));

      productData.append(priceElement);
    }

    const counterControl: CounterControl = new CounterControl((count: number) =>
      this.handleChangeCount.apply(this, [count, price!])
    );

    const wrapperCounterPrice: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.wrapperCounterPrice],
      children: [counterControl.getElement(), this.totalPrice.getElement()],
    }).getElement();

    controls.append(wrapperCounterPrice, buttonDelete);

    card.append(productData, controls);
  }

  private handleChangeCount(count: number, price: TypedMoney): void {
    const total: number = price.centAmount * count;
    const newPrice: TypedMoney = { ...price, centAmount: total };
    this.totalPrice.setPrice(String(converterPrice(newPrice)));
  }
}
