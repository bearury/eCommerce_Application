import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './burger-button.module.scss';

export interface BurgerMenuBtnProps {
  callbackBtn: Function;
}

export default class BurgerButton extends View {
  burgerLine1: HTMLElement;

  burgerLine2: HTMLElement;

  constructor({ callbackBtn }: BurgerMenuBtnProps) {
    const params: ParamsElementCreator = {
      tag: 'button',
      classNames: [styles.burgerMenuBtn],
      callback: [{ event: 'click', callback: callbackBtn }],
    };
    super(params);

    this.burgerLine1 = new ElementCreator({
      tag: 'div',
      classNames: [styles.burgerLine, styles.burgerLine1],
    }).getElement();
    this.burgerLine2 = new ElementCreator({
      tag: 'div',
      classNames: [styles.burgerLine, styles.burgerLine2],
    }).getElement();

    this.configureView();
  }

  public rotateLine() {
    this.burgerLine1.classList.toggle(styles.active);
    this.burgerLine2.classList.toggle(styles.active);
  }

  private configureView(): void {
    const burgerMenuBtn: HTMLElement = this.getElement();
    burgerMenuBtn.append(this.burgerLine1, this.burgerLine2);
  }
}
