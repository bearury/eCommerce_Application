import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './products-card.module.scss';
import { Product, ProductVariant } from '@commercetools/platform-sdk';
import Image from '@components/image/image';
import noImage from '/no-image.jpg';

export class ProductsCard extends View {
  constructor(data: Product) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.card],
    };
    super(params);

    this.configureView(data);
  }

  private configureView(data: Product): void {
    console.log('🍁: ', data.masterData.current.variants);

    const card: HTMLElement = this.getElement();

    const textName = data.masterData.current.name['en-US'];

    // const currentVariants: ProductVariant[] = data.masterData.current.variants;

    const stagedVariants: ProductVariant = data.masterData.staged.masterVariant;

    console.log('🧬:', stagedVariants.images);

    const name = new ElementCreator({
      tag: 'span',
      classNames: [styles.name],
      textContent: textName,
    }).getElement();

    let image: HTMLElement;

    if (stagedVariants && stagedVariants.images) {
      const img = stagedVariants.images[0].url as string;
      image = new Image({ classNames: [styles.image], img }).getElement();
    } else {
      image = new Image({ classNames: [styles.image], img: noImage }).getElement();
    }

    card.append(image, name);
  }
}
