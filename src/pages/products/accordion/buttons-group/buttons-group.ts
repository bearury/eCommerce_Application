import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './buttons-group.module.scss';

export class ButtonsGroup extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.blockButton],
    };
    super(params);
    this.configureView();
  }

  private configureView(): void {
    const applyButton: HTMLElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.button],
      textContent: 'Apply',
    }).getElement();

    const cancelButton: HTMLElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.button],
      textContent: 'Cancel',
    }).getElement();

    this.getElement().append(applyButton, cancelButton);
  }
}
