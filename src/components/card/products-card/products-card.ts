import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './products-card.module.scss';
import { Price, ProductProjection } from '@commercetools/platform-sdk';
import converterPrice from '@utils/converter-price.ts';
import Image from '@components/image/image';
import noImage from '/noImage.png';

export class ProductsCard extends View {
  constructor({ data, callback }: { data: ProductProjection; callback: (id: string) => void }) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.card],
      callback: [{ event: 'click', callback: () => callback(data.id) }],
    };
    super(params);
    this.configureView(data);
  }

  private configureView(data: ProductProjection): void {
    const card: HTMLElement = this.getElement();
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

    card.append(image, name, pricesWrapper, description, discountUsd, discountEur);
  }
}
