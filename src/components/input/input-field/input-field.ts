import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './input-field.module.scss';

export interface InputFiledProps {
  name: string;
  type: InputFieldType;
  callback: () => void;
  disabled?: boolean;
  additionalClasses?: string[];
}

export const enum InputFieldType {
  text = 'text',
  date = 'date',
  password = 'password',
}

export default class InputField extends View {
  input: ElementCreator;

  label: ElementCreator;

  error: ElementCreator;

  constructor({ name, type, callback, disabled = false, additionalClasses = [] }: InputFiledProps) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.inputItem, ...additionalClasses],
    };
    super(params);
    const attributes = [
      { type: 'id', value: name },
      { type: 'autocomplete', value: 'off' },
      { type: 'required', value: name },
      { type: 'type', value: type },
    ];
    if (disabled) {
      attributes.push({ type: 'disabled', value: 'disabled' });
    }
    this.input = new ElementCreator({
      tag: 'input',
      classNames: [styles.input],
      callback: [{ event: 'input', callback }],
      attribute: attributes,
    });
    this.label = new ElementCreator({
      tag: 'label',
      classNames: [styles.label],
      attribute: [{ type: 'for', value: name }],
      textContent: name,
    });
    this.error = new ElementCreator({
      tag: 'ul',
      classNames: [styles.error],
    });

    this.renderView();
  }

  public getValue(): string {
    const input: HTMLInputElement = this.input.getElement() as HTMLInputElement;
    return input.value;
  }

  public setErrors(errors: string[]): void {
    const error: HTMLElement = this.error.getElement();

    if (errors.length) {
      error.classList.add(styles.active);
    } else {
      error.classList.remove(styles.active);
    }

    error.replaceChildren();

    errors.forEach((err: string): void => {
      const errorElement: ElementCreator = new ElementCreator({
        tag: 'li',
        classNames: [styles.errorElement],
        textContent: err,
      });
      error.append(errorElement.getElement());
    });
  }

  protected renderView(): void {
    const wrapperInput: ElementCreator = new ElementCreator({
      tag: 'div',
      classNames: [styles.wrapperInput],
      children: [this.input.getElement(), this.label.getElement()],
    });

    this.getElement().append(wrapperInput.getElement(), this.error.getElement());
  }

  public clearValue() {
    const input: HTMLInputElement = this.input.getElement() as HTMLInputElement;
    input.value = '';
  }

  public clearErrors() {
    this.setErrors([]);
  }

  public setValue(value: string): void {
    const input: HTMLInputElement = this.input.getElement() as HTMLInputElement;
    input.value = value;
  }
}
