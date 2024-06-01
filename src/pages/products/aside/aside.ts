import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './aside.module.scss';
import Dropdown from '@components/dropdown/dropdown';

export default class Aside extends View {
  dropdown: Dropdown;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'aside',
      classNames: [styles.aside],
    };
    super(params);
    this.dropdown = new Dropdown(this.handleDropdownChange.bind(this));
    this.configureView();
  }

  private configureView(): void {
    const aside = this.getElement();

    aside.append(this.dropdown.getElement());
  }

  private handleDropdownChange(): void {
    console.log('🧨: ', this.dropdown.getValue());
  }
}
