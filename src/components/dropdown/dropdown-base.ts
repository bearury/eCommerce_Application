import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator';
import styles from './dropdown.module.scss';

export interface ItemDropdown {
  id: string;
  title: ItemDropdownTitle;
}

export const enum ItemDropdownTitle {
  USA = 'US',
  DE = 'DE',
  UK = 'UK',
}

export default class DropdownBase extends View {
  // status: boolean;
  //
  // items: ItemDropdown[];
  //
  // input: ElementCreator;
  //
  // popup: DropdownPopup;
  //
  // inner: HTMLElement;

  callback: () => void;

  constructor(callback: () => void) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.dropdown],
    };
    super(params);

    this.callback = callback;
    //
    // this.items = [
    //   { id: '1', title: ItemDropdownTitle.USA },
    //   { id: '2', title: ItemDropdownTitle.DE },
    //   { id: '3', title: ItemDropdownTitle.UK },
    // ];

    // this.status = false;
    // this.popup = new DropdownPopup({ items: this.items, callback: this.handleCheck.bind(this) });
    // this.inner = new ElementCreator({
    //   tag: 'div',
    //   classNames: [styles.inner],
    // }).getElement();
    // this.input = new ElementCreator({
    //   tag: 'input',
    //   classNames: [styles.input],
    //   attribute: [
    //     { type: 'type', value: 'text' },
    //     { type: 'readonly', value: '' },
    //   ],
    // });
    // this.configureView();
  }

  // public getValue(): ItemDropdownTitle | '' {
  //   const input = this.input.getElement() as HTMLInputElement;
  //   return input.value as ItemDropdownTitle | '';
  // }
  //
  // public setError(): void {
  //   this.inner.classList.add(styles.error);
  // }
  //
  // public clearError() {
  //   this.inner.classList.remove(styles.error);
  // }
  //
  // private configureView(): void {
  //   const dropdown: HTMLElement = this.getElement();
  //
  //   const icon: HTMLElement = new ElementCreator({ tag: 'div', classNames: [styles.icon] }).getElement();
  //   icon.innerHTML = svgHtmlArrow;
  //
  //   const toggle: ElementCreator = new ElementCreator({
  //     tag: 'button',
  //     classNames: [styles.toggle],
  //     attribute: [{ type: 'type', value: 'button' }],
  //     callback: [{ event: 'click', callback: this.handleClickToggle.bind(this) }],
  //     children: [this.input.getElement(), icon],
  //   });
  //
  //   this.inner.append(toggle.getElement());
  //
  //   dropdown.append(this.inner, this.popup.getElement());
  // }
  //
  // private handleClickToggle(): void {
  //   const button: HTMLElement = this.getElement();
  //   this.status = !this.status;
  //   button.classList.toggle(styles.active, this.status);
  //   this.popup.toggle(this.status);
  // }
  //
  // private handleCheck(param: string): void {
  //   const input: HTMLInputElement = this.input.getElement() as HTMLInputElement;
  //   input.value = param;
  //   this.clearError();
  //   this.callback();
  //   this.handleClickToggle();
  // }
}
