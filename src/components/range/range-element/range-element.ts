import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import './range.css';

export interface RangeElementProps {
  minCurrentValue?: number;
  maxCurrentValue?: number;
  minValue: number;
  maxValue: number;
}

export default class RangeElement extends View {
  value: { min: number; max: number };

  constructor({
    maxValue,
    minValue,
    maxCurrentValue = maxValue * 0.6,
    minCurrentValue = maxValue * 0.3,
  }: RangeElementProps) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: ['range'],
    };
    super(params);
    this.value = { min: minCurrentValue, max: maxCurrentValue };
    this.configureView({ min: minValue, max: maxValue });
  }

  public getValue(): { min: number; max: number } {
    return this.value;
  }

  private configureView({ min, max }: { min: number; max: number }): void {
    const range = this.getElement() as HTMLInputElement;
    const slider = noUiSlider.create(range, {
      start: [this.value.min, this.value.max],
      connect: true,
      tooltips: [
        {
          to: function (value: number) {
            return Math.round(value);
          },
        },
        {
          to: function (value: number) {
            return Math.round(value);
          },
        },
      ],
      range: {
        min,
        max,
      },
    });

    slider.on('update', function (values) {
      console.log('🍁: ', Math.round(Number(values[0])));
    });
  }
}
