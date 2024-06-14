import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './products-card.module.scss';
import { Price, ProductProjection } from '@commercetools/platform-sdk';
import converterPrice from '@utils/converter-price.ts';
import Image from '@components/image/image';
import noImage from '/noImage.png';
import Input, { InputType } from '@components/input/input';
import Cart from '@api/cart';
import { apiInstance } from '@api/api';

export class ProductsCard extends View {
  callback: Function;

  addToCartButton: Input;

  productId: string;

  constructor({ data, callback }: { data: ProductProjection; callback: (id: string) => void }) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.card],
    };
    super(params);
    this.productId = data.id;
    this.callback = callback;
    this.addToCartButton = new Input({
      inputType: InputType.button,
      callbacks: [{ event: 'click', callback: this.addToCart.bind(this) }],
      classNames: ['button'],
      value: 'Add to cart 🛒',
      disabled: false,
    });
    this.configureView(data);
  }

  private configureView(data: ProductProjection): void {
    const card: HTMLElement = this.getElement();
    const activeWrapper: HTMLElement = new ElementCreator({
      tag: 'div',
      callback: [{ event: 'click', callback: () => this.callback(data.id) }],
    }).getElement();
    const textName = data.name['en-US'];
    const images = data.masterVariant.images;
    const pricesValue: Price[] | undefined = data.masterVariant.prices?.filter(
      (price: Price) => price.value.currencyCode === 'EUR' || price.value.currencyCode === 'USD'
    );
    const descriptionValue: string | undefined = data.description?.['en-US'];

    const pricesWrapper: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.pricesWrapper],
    }).getElement();

    const name: HTMLElement = new ElementCreator({
      tag: 'span',
      classNames: [styles.name],
      textContent: textName,
    }).getElement();

    const description: HTMLElement = new ElementCreator({
      tag: 'span',
      classNames: [styles.description],
      textContent: descriptionValue,
    }).getElement();

    let image: HTMLElement;

    if (images?.length) {
      const img = images[0].url as string;
      image = new Image({ classNames: [styles.image], img }).getElement();
    } else {
      image = new Image({ classNames: [styles.image], img: noImage }).getElement();
    }

    const discountUsd = new ElementCreator({
      tag: 'div',
      classNames: [styles.discount],
    }).getElement();

    const discountEur = new ElementCreator({
      tag: 'div',
      classNames: [styles.discount, styles.usd],
    }).getElement();

    pricesValue?.forEach((price) => {
      const priceElement: HTMLElement = new ElementCreator({
        tag: 'span',
        classNames: [styles.price],
        textContent: `${converterPrice(price.value)} ${price.value.currencyCode}`,
      }).getElement();

      if (price.discounted) {
        priceElement.classList.add(styles.priceDiscount);

        if (price.country === 'US') {
          discountUsd.textContent = `${converterPrice(price.discounted.value)} ${price.value.currencyCode}`;
        } else if (price.country === 'DE') {
          discountEur.textContent = `${converterPrice(price.discounted.value)} ${price.value.currencyCode}`;
        }
      }
      pricesWrapper.append(priceElement);
    });
    activeWrapper.append(image, name, pricesWrapper, description, discountUsd, discountEur);
    card.append(activeWrapper, this.addToCartButton.getElement());
  }

  private async addToCart() {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      throw new Error('No cart id!');
    }
    const response = await new Cart(apiInstance).addToCart(cartId, this.productId);
    if (response && response.statusCode === 200) {
      const button = this.addToCartButton.getElement() as HTMLButtonElement;
      button.value = 'In cart ✅';
      button.disabled = true;
    }
  }
}
