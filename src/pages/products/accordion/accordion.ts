import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './accordion.module.scss';
import Dropdown from '@components/dropdown/dropdown';
import AccordionButton from '@components/buttons/accordion-button/accordion-button';
import RangeComponent from '@components/range/range';

export default class Accordion extends View {
  dropdown: Dropdown;

  content: HTMLElement | null;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.accordion],
    };
    super(params);
    this.dropdown = new Dropdown(this.handleDropdownChange.bind(this));
    this.content = null;
    this.configureView();
  }

  private configureView(): void {
    const accordion = this.getElement();

    const item = new ElementCreator({ tag: 'div', classNames: [styles.item] }).getElement();
    const toggleButton = new AccordionButton({
      content: '⚙ filters',
      callback: this.handleClickOpenAccordion.bind(this),
    }).getElement();
    this.content = new ElementCreator({
      tag: 'div',
      classNames: [styles.content],
    }).getElement();

    const applyButton = new ElementCreator({
      tag: 'button',
      classNames: [styles.sendButton],
      textContent: 'Apply',
    }).getElement();

    const range = new RangeComponent().getElement();

    this.content.append(this.dropdown.getElement(), range, applyButton);

    item.append(toggleButton, this.content);

    accordion.append(item);
  }

  private handleDropdownChange(): void {
    console.log('🧨: ', this.dropdown.getValue());
  }

  private handleClickOpenAccordion(): void {
    this.content?.classList.toggle(styles.active);
  }
}
