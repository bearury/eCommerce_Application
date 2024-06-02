import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './dropdown-element.module.scss';
import DropdownNew from '@components/dropdown/dropdown-new/dropdown-new';
import { ItemDropdownProps, SelectBrand, SelectColor } from '@utils/variables.ts';

export class DropdownElement extends View {
  constructor({
    title,
    callback,
    select,
  }: {
    title: string;
    callback: () => void;
    select: ItemDropdownProps<SelectColor>[] | ItemDropdownProps<SelectBrand>[];
  }) {
    const params: ParamsElementCreator = {
      tag: 'label',
      classNames: [styles.label],
      textContent: title,
    };
    super(params);
    const dropdown: HTMLElement = new DropdownNew(callback, select).getElement();

    this.getElement().append(dropdown);
  }
}
