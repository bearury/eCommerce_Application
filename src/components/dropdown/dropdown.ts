import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator';
import styles from './dropdown.module.scss';
import { svgHtmlArrow } from '@components/svg/arrorw';
import DropdownPopup from '@components/dropdown/dropdown-popup/dropdown-popup';

export interface ItemDropdown {
  id: string;
  title: string;
}

export default class Dropdown extends View {
  status: boolean;

  items: ItemDropdown[];

  input: ElementCreator;

  popup: DropdownPopup;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.dropdown],
    };
    super(params);

    this.items = [
      { id: '1', title: 'USA' },
      { id: '2', title: 'DE' },
      { id: '3', title: 'UK' },
    ];

    this.status = false;
    this.popup = new DropdownPopup({ items: this.items, callback: this.handleCheck.bind(this) });
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

    const inner: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.inner],
      children: [toggle.getElement()],
    }).getElement();

    dropdown.append(inner, this.popup.getElement());
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
    this.handleClickToggle();
  }
}
