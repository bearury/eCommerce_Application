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

export interface RangeValue {
  min: number;
  max: number;
}

export default class RangeElement extends View {
  value: RangeValue;

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
    this.value = { max: maxCurrentValue, min: minCurrentValue };
    this.configureView({ min: minValue, max: maxValue });
  }

  public getValue(): RangeValue {
    return this.value;
  }

  private configureView({ min, max }: { min: number; max: number }): void {
    const range = this.getElement() as HTMLInputElement;

    const setValue = (value: RangeValue): void => {
      this.value = value;
    };

    const slider = noUiSlider.create(range, {
      start: [this.value.min, this.value.max],
      connect: true,
      step: max > 100 ? 10 : 1,
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
      setValue({ min: Number(values[0]), max: Number(values[1]) });
    });
  }
}
