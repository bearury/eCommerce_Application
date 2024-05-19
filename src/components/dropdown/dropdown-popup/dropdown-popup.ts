import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './dropdown-popup.module.scss';
import { ItemDropdown } from '@components/dropdown/dropdown';

export default class DropdownPopup extends View {
  items: ItemDropdown[];

  constructor({ items, callback }: { items: ItemDropdown[]; callback: (param: string) => void }) {
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

    this.items.map((item: ItemDropdown) => {
      const button = new ElementCreator({
        tag: 'button',
        classNames: [styles.button],
        callback: [{ event: 'click', callback: () => callback(item.title) }],
        textContent: item.title,
      }).getElement();

      menu.append(button);
    });

    this.getElement().append(menu);
  }
}
