import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './buttons-group.module.scss';

export type ButtonsGroupType = 'Apply' | 'Cancel';

export class ButtonsGroup extends View {
  callback: (type: ButtonsGroupType) => void;

  constructor(callback: (type: ButtonsGroupType) => void) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.blockButton],
    };
    super(params);
    this.callback = callback;
    this.configureView();
  }

  private configureView(): void {
    const applyButton: HTMLElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.button],
      callback: [{ event: 'click', callback: () => this.handleClickButton.call(this, 'Apply') }],
      textContent: 'Apply',
    }).getElement();

    const cancelButton: HTMLElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.button],
      callback: [{ event: 'click', callback: () => this.handleClickButton.call(this, 'Cancel') }],
      textContent: 'Cancel',
    }).getElement();

    this.getElement().append(applyButton, cancelButton);
  }

  private handleClickButton(type: ButtonsGroupType): void {
    this.callback(type);
  }
}
