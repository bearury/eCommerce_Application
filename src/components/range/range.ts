import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import './range.css';

export default class RangeComponent extends View {
  value: { min: number; max: number };

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: ['range'],
    };
    super(params);
    this.value = { min: 10, max: 50 };
    this.configureView();
  }

  public getValue(): { min: number; max: number } {
    return this.value;
  }

  private configureView(): void {
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
        min: 0,
        max: 100,
      },
    });

    slider.on('update', function (values) {
      console.log('🍁: ', Math.round(Number(values[0])));
    });
  }
}
