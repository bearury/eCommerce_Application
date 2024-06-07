import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator';
import styles from './dropdown.module.scss';
import { svgHtmlArrow } from '@components/svg/arrorw';
import DropdownPopup from '@components/dropdown/dropdown-popup/dropdown-popup';

export interface ItemDropdown {
  id: string;
  title: ItemDropdownTitle;
}

export const enum ItemDropdownTitle {
  USA = 'US',
  DE = 'DE',
  UK = 'UK',
}

export default class Dropdown extends View {
  status: boolean;

  items: ItemDropdown[];

  input: ElementCreator;

  popup: DropdownPopup;

  inner: HTMLElement;

  toggle: ElementCreator;

  icon: HTMLElement;

  callback: () => void;

  constructor(callback: () => void, additionalClassNames: string[] = []) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.dropdown, ...additionalClassNames],
    };
    super(params);

    this.callback = callback;

    this.items = [
      { id: '1', title: ItemDropdownTitle.USA },
      { id: '2', title: ItemDropdownTitle.DE },
      { id: '3', title: ItemDropdownTitle.UK },
    ];

    this.status = false;
    this.popup = new DropdownPopup({ items: this.items, callback: this.handleCheck.bind(this) });
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
    this.icon = new ElementCreator({ tag: 'div', classNames: [styles.icon] }).getElement();
    this.icon.innerHTML = svgHtmlArrow;
    this.toggle = new ElementCreator({
      tag: 'button',
      classNames: [styles.toggle],
      attribute: [{ type: 'type', value: 'button' }],
      callback: [{ event: 'click', callback: this.handleClickToggle.bind(this) }],
      children: [this.input.getElement(), this.icon],
    });
    this.configureView();
  }

  private configureView(): void {
    const dropdown: HTMLElement = this.getElement();
    this.inner.append(this.toggle.getElement());
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

  public getValue(): ItemDropdownTitle | '' {
    const input = this.input.getElement() as HTMLInputElement;
    return input.value as ItemDropdownTitle | '';
  }

  public setValue(value: string): void {
    const input = this.input.getElement() as HTMLInputElement;
    input.value = value;
  }

  public setError(): void {
    this.inner.classList.add(styles.error);
  }

  public clearError() {
    this.inner.classList.remove(styles.error);
  }

  public toggleDisabled(isDisabled: boolean): void {
    const input = this.input.getElement() as HTMLInputElement;
    input.disabled = isDisabled;
    const toggle = this.toggle.getElement() as HTMLButtonElement;
    toggle.disabled = isDisabled;
  }
}
