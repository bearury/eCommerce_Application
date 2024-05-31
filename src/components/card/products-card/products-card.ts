import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './products-card.module.scss';
import { Price, Product, ProductVariant } from '@commercetools/platform-sdk';
import Image from '@components/image/image';
import noImage from '/no-image.jpg';
import converterPrice from '@utils/converter-price.ts';

export class ProductsCard extends View {
  constructor({ data, callback }: { data: Product; callback: (id: string) => void }) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.card],
      callback: [{ event: 'click', callback: () => callback(data.id) }],
    };
    super(params);
    this.configureView(data);
  }

  private configureView(data: Product): void {
    const card: HTMLElement = this.getElement();
    const textName = data.masterData.current.name['en-US'];
    const stagedVariants: ProductVariant = data.masterData.staged.masterVariant;
    const pricesValue: Price[] | undefined = data.masterData.staged.masterVariant.prices?.filter(
      (price: Price) => price.value.currencyCode === 'EUR' || price.value.currencyCode === 'USD'
    );
    const descriptionValue: string | undefined = data.masterData.staged.description?.['en-US'];

    const pricesWrapper: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.pricesWrapper],
    }).getElement();

    pricesValue?.forEach((price) => {
      const priceElement: HTMLElement = new ElementCreator({
        tag: 'span',
        classNames: [styles.price],
        textContent: `${converterPrice(price)} ${price.value.currencyCode}`,
      }).getElement();

      pricesWrapper.append(priceElement);
    });

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

    if (stagedVariants && stagedVariants.images) {
      const img = stagedVariants.images[0].url as string;
      image = new Image({ classNames: [styles.image], img }).getElement();
    } else {
      image = new Image({ classNames: [styles.image], img: noImage }).getElement();
    }

    card.append(image, name, pricesWrapper, description);
  }
}
