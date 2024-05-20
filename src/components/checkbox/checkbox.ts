import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './checkbox.module.scss';

export interface CheckboxProps {
  label: string;
  callback?: () => void;
}

export default class Checkbox extends View {
  label: string;

  input: ElementCreator;

  callback?: () => void;

  constructor({ label, callback }: CheckboxProps) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.checkbox],
    };
    super(params);
    this.callback = callback;

    this.input = new ElementCreator({
      tag: 'input',
      attribute: [{ type: 'type', value: 'checkbox' }],
      callback: this.callback && [{ event: 'input', callback: this.callback }],
      classNames: [styles.input],
    });

    this.label = label;
    this.configureView();
  }

  public getStatus() {
    const input: HTMLInputElement = this.input.getElement() as HTMLInputElement;
    return input.checked;
  }

  private configureView(): void {
    const checkbox: HTMLElement = this.getElement();

    const text: HTMLElement = new ElementCreator({
      tag: 'span',
      textContent: this.label,
      classNames: [styles.text],
    }).getElement();
    const label: HTMLElement = new ElementCreator({
      tag: 'label',
      classNames: [styles.label],
      children: [text, this.input.getElement()],
    }).getElement();

    checkbox.append(label);
  }
}
