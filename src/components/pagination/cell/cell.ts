import View from '@utils/view';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator';
import styles from './cell.module.scss';

export default class Cell extends View {
  page: HTMLElement;

  value: number;

  constructor({ numberPage, callback }: { numberPage: number; callback: (params: number) => void }) {
    const params: ParamsElementCreator = {
      tag: 'button',
      classNames: [styles.cell],
      callback: [{ event: 'click', callback: () => callback(numberPage) }],
    };
    super(params);
    this.value = numberPage;
    this.page = new ElementCreator({ tag: 'span', textContent: numberPage.toString() }).getElement();
    this.getElement().append(this.page);
  }

  public setActive(): void {
    this.getElement().setAttribute('disabled', 'true');
  }

  public removeActive(): void {
    this.getElement().removeAttribute('disabled');
  }

  public getValue() {
    return this.value;
  }
}
