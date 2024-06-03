import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './range.module.scss';
import RangeElement, { RangeElementProps, RangeValue } from '@components/range/range-element/range-element';
import Checkbox from '@components/checkbox/checkbox';

export const enum RangeId {
  price = 'price',
  wattage = 'wattage',
}

export interface RangeComponentValue {
  statusCheckbox: boolean;
  value: RangeValue;
}

export class RangeComponent extends View {
  rangeElement: RangeElement;

  id: RangeId;

  callback: (value: RangeValue) => void;

  checkbox: Checkbox;

  constructor({
    id,
    label,
    props,
    callback,
  }: {
    id: RangeId;
    label: string;
    props: RangeElementProps;
    callback: (value: RangeValue) => void;
  }) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.range],
    };
    super(params);
    this.id = id;
    this.callback = callback;
    this.rangeElement = new RangeElement(props);
    this.checkbox = new Checkbox({
      label: 'Apply filter',
      callback: this.handleCheckboxClick.bind(this),
    });
    this.configureView(label);
  }

  public getValue(): RangeComponentValue {
    return { statusCheckbox: this.checkbox.getStatus(), value: this.rangeElement.getValue() };
  }

  private configureView(labelValue: string): void {
    const checkboxBlock: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.checkboxBlock],
      children: [this.checkbox.getElement()],
    }).getElement();

    const blockLabel: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.blockLabel],
      children: [checkboxBlock, this.rangeElement.getElement()],
    }).getElement();

    const label: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.label],
      textContent: labelValue,
      children: [blockLabel],
    }).getElement();

    this.getElement().append(label);
  }

  private handleCheckboxClick(): void {
    this.callback(this.rangeElement.getValue());
  }
}
