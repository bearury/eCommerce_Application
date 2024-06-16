import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './total-price-item.module.scss';

export class TotalPriceItem extends View {
  totalPrice: HTMLElement;

  price: string;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.totalPrice],
    };
    super(params);

    this.price = '0';

    this.totalPrice = new ElementCreator({
      tag: 'span',
      classNames: [styles.count],
      textContent: `${this.price}`,
    }).getElement();

    this.renderPrice();
  }

  public setPrice(price: string) {
    this.price = price;
    this.totalPrice.textContent = `${this.price}`;
  }

  private renderPrice() {
    const item = this.getElement();

    item.innerHTML = `Total: `;

    item.appendChild(this.totalPrice);

    item.append(` USD`);
  }
}
