import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './products-card.module.scss';
import { Product, ProductVariant } from '@commercetools/platform-sdk';
import Image from '@components/image/image';

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

    const name = new ElementCreator({
      tag: 'span',
      classNames: [styles.name],
      textContent: textName,
    }).getElement();

    if (stagedVariants && stagedVariants.images) {
      const img = stagedVariants.images[1].url as string;

      const image = new Image({ classNames: [styles.image], img }).getElement();

      card.append(image);
    }

    card.append(name);
  }
}
