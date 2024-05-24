import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './card-product-page.module.scss';

export default class CardProductPage extends View {
  constructor(resource: string) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.cardProduct],
    };
    super(params);

    this.configureView(resource);
  }

  private configureView(resource: string): void {
    const cardProduct: HTMLElement = this.getElement();

    cardProduct.textContent = `Card product ${resource}}`;
  }
}
