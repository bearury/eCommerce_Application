import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './dropdown-popup-new.module.scss';
import { ItemDropdownProps, SelectBrand, SelectColor } from '@utils/variables.ts';

export default class DropdownPopupNew extends View {
  items: ItemDropdownProps<SelectColor | SelectBrand>[];

  constructor({
    items,
    callback,
  }: {
    items: ItemDropdownProps<SelectColor | SelectBrand>[];
    callback: (param: string) => void;
  }) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.popup],
    };
    super(params);
    this.items = items;

    this.configureView(callback);
  }

  public toggle(status: boolean): void {
    const popup = this.getElement();
    popup.classList.toggle(styles.popupActive, status);
  }

  private configureView(callback: (param: string) => void): void {
    const menu = new ElementCreator({ tag: 'div', classNames: [styles.menu] }).getElement();

    this.items.map((item: ItemDropdownProps<SelectColor | SelectBrand>) => {
      const button = new ElementCreator({
        tag: 'button',
        classNames: [styles.button],
        attribute: [{ type: 'type', value: 'button' }],
        callback: [{ event: 'click', callback: () => callback(item.title) }],
        textContent: item.title,
      }).getElement();

      menu.append(button);
    });

    this.getElement().append(menu);
  }
}
