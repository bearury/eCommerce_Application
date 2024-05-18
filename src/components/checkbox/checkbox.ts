import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './checkbox.module.scss';

export default class Checkbox extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.checkbox],
    };
    super(params);

    this.configureView();
  }

  private configureView(): void {
    const checkbox: HTMLElement = this.getElement();
    const input: HTMLElement = new ElementCreator({
      tag: 'input',
      attribute: [{ type: 'type', value: 'checkbox' }],
      callback: [{ event: 'input', callback: this.handleChange }],
      classNames: [styles.input],
    }).getElement();
    const text: HTMLElement = new ElementCreator({
      tag: 'span',
      textContent: 'Функция для обработки нажатия не перадана агрументом',
      classNames: [styles.text],
    }).getElement();
    const label: HTMLElement = new ElementCreator({
      tag: 'label',
      classNames: [styles.label],
      children: [text, input],
    }).getElement();

    checkbox.append(label);
  }

  private handleChange(e: PointerEvent): void {
    console.log('[21] 🐬: ', e.target);
  }
}
