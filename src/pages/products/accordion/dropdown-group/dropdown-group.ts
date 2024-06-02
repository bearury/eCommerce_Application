import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './dropdown-group.module.scss';
import { selectBrand, selectColor } from '@utils/variables.ts';
import { DropdownElement } from '@pages/products/accordion/dropdown-group/dropdown-element/dropdown-element';

export class DropdownGroup extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.blockDropdown],
    };
    super(params);
    this.configureView();
  }

  public getValue() {
    return 'test';
  }

  private configureView(): void {
    const brandDropdown: HTMLElement = new DropdownElement({
      title: '🏷 Select Brand',
      callback: this.handleDropdownChange.bind(this),
      select: selectBrand,
    }).getElement();

    const colorDropdown: HTMLElement = new DropdownElement({
      title: '🖌 Select Color',
      callback: this.handleDropdownChange.bind(this),
      select: selectColor,
    }).getElement();

    this.getElement().append(colorDropdown, brandDropdown);
  }

  private handleDropdownChange(): void {
    console.log('[30] 🎯: dropdownChange');
  }
}
