import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './dropdown-new.module.scss';
import { svgHtmlArrow } from '@components/svg/arrorw';
import { ItemDropdownProps, SelectBrand, SelectColor } from '@utils/variables.ts';
import DropdownPopupNew from '@components/dropdown/dropdown-new/dropdown-popup/dropdown-popup-new';

export default class DropdownNew extends View {
  status: boolean;

  input: ElementCreator;

  popup: DropdownPopupNew;

  inner: HTMLElement;

  callback: () => void;

  constructor(callback: () => void, items: ItemDropdownProps<SelectColor | SelectBrand>[]) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.dropdown],
    };
    super(params);

    this.callback = callback;

    this.status = false;
    this.popup = new DropdownPopupNew({ items, callback: this.handleCheck.bind(this) });
    this.inner = new ElementCreator({
      tag: 'div',
      classNames: [styles.inner],
    }).getElement();
    this.input = new ElementCreator({
      tag: 'input',
      classNames: [styles.input],
      attribute: [
        { type: 'type', value: 'text' },
        { type: 'readonly', value: '' },
      ],
    });
    this.configureView();
  }

  public getValue(): SelectColor | '' {
    const input = this.input.getElement() as HTMLInputElement;
    return input.value as SelectColor | '';
  }

  public setError(): void {
    this.inner.classList.add(styles.error);
  }

  public clearError() {
    this.inner.classList.remove(styles.error);
  }

  public clearValue() {
    const input = this.input.getElement() as HTMLInputElement;
    input.value = '';
  }

  private configureView(): void {
    const dropdown: HTMLElement = this.getElement();

    const icon: HTMLElement = new ElementCreator({ tag: 'div', classNames: [styles.icon] }).getElement();
    icon.innerHTML = svgHtmlArrow;

    const toggle: ElementCreator = new ElementCreator({
      tag: 'button',
      classNames: [styles.toggle],
      attribute: [{ type: 'type', value: 'button' }],
      callback: [{ event: 'click', callback: this.handleClickToggle.bind(this) }],
      children: [this.input.getElement(), icon],
    });

    this.inner.append(toggle.getElement());

    dropdown.append(this.inner, this.popup.getElement());
  }

  private handleClickToggle(): void {
    const button: HTMLElement = this.getElement();
    this.status = !this.status;
    button.classList.toggle(styles.active, this.status);
    this.popup.toggle(this.status);
  }

  private handleCheck(param: string): void {
    const input: HTMLInputElement = this.input.getElement() as HTMLInputElement;
    input.value = param;
    this.clearError();
    this.callback();
    this.handleClickToggle();
  }
}
