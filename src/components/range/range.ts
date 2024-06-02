import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './range.module.scss';
import RangeElement, { RangeElementProps } from '@components/range/range-element/range-element';
import Checkbox from '@components/checkbox/checkbox';

export class RangeComponent extends View {
  constructor(label: string, props: RangeElementProps) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.range],
    };
    super(params);
    this.configureView(label, props);
  }

  private configureView(labelValue: string, props: RangeElementProps): void {
    const rangeComponent: HTMLElement = new RangeElement(props).getElement();

    const checkbox = new Checkbox({
      label: 'Apply filter',
      callback: this.handleCheckboxClick.bind(this),
    }).getElement();

    const checkboxBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.checkboxBlock],
      children: [checkbox],
    }).getElement();

    const blockLabel = new ElementCreator({
      tag: 'div',
      classNames: [styles.blockLabel],
      children: [checkboxBlock, rangeComponent],
    }).getElement();

    const label: HTMLElement = new ElementCreator({
      tag: 'label',
      classNames: [styles.label],
      textContent: labelValue,
      children: [blockLabel],
    }).getElement();

    this.getElement().append(label);
  }

  private handleCheckboxClick(): void {}
}
