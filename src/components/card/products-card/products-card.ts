import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './products-card.module.scss';
import { Price, ProductProjection } from '@commercetools/platform-sdk';
import converterPrice from '@utils/converter-price.ts';
import Image from '@components/image/image';
import noImage from '/noImage.png';
import Input, { InputType } from '@components/input/input';

export class ProductsCard extends View {
  callback: Function;

  addToCartButton: Input;

  productId: string;

  addToCartCallback: Function;

  constructor({
    data,
    callback,
    addToCartCallback,
    buttonValue,
    isDisabledButton,
  }: {
    data: ProductProjection;
    callback: (id: string) => void;
    addToCartCallback: (productId: string, button: HTMLButtonElement) => void;
    buttonValue: string;
    isDisabledButton: boolean;
  }) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.card],
    };
    super(params);
    this.productId = data.id;
    this.callback = callback;
    this.addToCartCallback = addToCartCallback;
    this.addToCartButton = new Input({
      inputType: InputType.button,
      callbacks: [
        {
          event: 'click',
          callback: () =>
            this.addToCartCallback(this.productId, this.addToCartButton.getElement() as HTMLButtonElement),
        },
      ],
      classNames: ['button'],
      value: buttonValue,
      disabled: isDisabledButton,
    });
    this.configureView(data);
  }

  private async configureView(data: ProductProjection): Promise<void> {
    const card: HTMLElement = this.getElement();
    const activeWrapper: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.activeWrapper],
      callback: [{ event: 'click', callback: () => this.callback(data.id) }],
    }).getElement();
    const textName = data.name['en-US'];
    const images = data.masterVariant.images;
    const pricesValue: Price[] | undefined = data.masterVariant.prices?.filter(
      (price: Price) => price.value.currencyCode === 'EUR'
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

        discountEur.textContent = `${converterPrice(price.discounted.value)} ${price.value.currencyCode}`;
      }
      pricesWrapper.append(priceElement);
    });
    activeWrapper.append(image, name, pricesWrapper, description, discountUsd, discountEur);
    card.append(activeWrapper, this.addToCartButton.getElement());
  }
}
