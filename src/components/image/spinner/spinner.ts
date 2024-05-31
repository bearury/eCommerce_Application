import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './spinner.module.scss';

export default class Spinner extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.spinner],
    };
    super(params);
    this.configureView();
  }

  public hide(): void {
    this.getElement().classList.add(styles.hide);
  }

  private configureView(): void {
    const spinnerChild1: HTMLElement = new ElementCreator({ tag: 'span' }).getElement();
    const spinnerChild2: HTMLElement = new ElementCreator({ tag: 'span' }).getElement();
    this.getElement().append(spinnerChild1, spinnerChild2);
  }
}
