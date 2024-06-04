import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './dropdown-group.module.scss';
import { SelectBrand, selectBrand, SelectColor, selectColor } from '@utils/variables.ts';
import { DropdownElement } from '@pages/products/accordion/dropdown-group/dropdown-element/dropdown-element';

export interface DropdownGroupValue {
  brand: SelectBrand | SelectColor | '';
  color: SelectBrand | SelectColor | '';
}

export class DropdownGroup extends View {
  brandDropdown: DropdownElement;

  colorDropdown: DropdownElement;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.blockDropdown],
    };
    super(params);
    this.brandDropdown = new DropdownElement({
      title: '🏷 Select Brand',
      callback: this.handleDropdownChange.bind(this),
      select: selectBrand,
    });

    this.colorDropdown = new DropdownElement({
      title: '🖌 Select Color',
      callback: this.handleDropdownChange.bind(this),
      select: selectColor,
    });
    this.configureView();
  }

  public getValue(): DropdownGroupValue {
    return { brand: this.brandDropdown.getValue(), color: this.colorDropdown.getValue() };
  }

  public clearValue(): void {
    this.colorDropdown.clearValue();
  }

  private configureView(): void {
    this.getElement().append(this.colorDropdown.getElement(), this.brandDropdown.getElement());
  }

  private handleDropdownChange(): void {}
}
