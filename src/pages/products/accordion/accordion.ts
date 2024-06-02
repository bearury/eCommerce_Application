import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './accordion.module.scss';
import AccordionButton from '@components/buttons/accordion-button/accordion-button';
import { ButtonsGroup } from '@pages/products/accordion/buttons-group/buttons-group';
import { RangeComponent } from '@components/range/range';
import { DropdownGroup } from '@pages/products/accordion/dropdown-group/dropdown-group';

export default class Accordion extends View {
  content: HTMLElement | null;

  dropdowns: DropdownGroup;

  buttons: ButtonsGroup;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.accordion],
    };
    super(params);

    this.buttons = new ButtonsGroup();
    this.dropdowns = new DropdownGroup();
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

    const rangeWattage = new RangeComponent('⚡ Select a Wattage', { minValue: 0, maxValue: 100 }).getElement();
    const rangePrice = new RangeComponent('💰 Select a price', { minValue: 0, maxValue: 10000 }).getElement();

    const rangeWrapper = new ElementCreator({
      tag: 'div',
      classNames: [styles.rangeWrapper],
      children: [rangePrice, rangeWattage],
    }).getElement();

    this.content.append(this.dropdowns.getElement(), rangeWrapper, this.buttons.getElement());

    item.append(toggleButton, this.content);

    accordion.append(item);
  }

  // private handleDropdownChange(): void {
  //   console.log('🧨: ', this.dropdowns.getValue());
  // }

  private handleClickOpenAccordion(): void {
    this.content?.classList.toggle(styles.active);
  }
}
