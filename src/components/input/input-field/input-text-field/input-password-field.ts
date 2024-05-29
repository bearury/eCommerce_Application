import InputField, { InputFiledProps } from '@components/input/input-field/input-field';
import { ElementCreator } from '@utils/element-creator.ts';
import { svgHtmlEye } from '@components/svg/eye';
import styles from './input-password-field.module.scss';

type InputPasswordFieldProps = Omit<InputFiledProps, 'type'>;

export default class InputPasswordField extends InputField {
  constructor({ name, callback, attributes }: InputPasswordFieldProps) {
    super({ name, callback, attributes });

    this.renderButton();
  }

  private changeType(): void {
    const input: HTMLInputElement = this.input.getElement() as HTMLInputElement;
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }

  private renderButton(): void {
    const input = this.input.getElement();
    const icon: HTMLElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.button],
      attribute: [{ type: 'type', value: 'button' }],
      callback: [{ event: 'click', callback: this.changeType.bind(this) }],
    }).getElement();
    icon.innerHTML = svgHtmlEye;
    input.before(icon);
  }
}
