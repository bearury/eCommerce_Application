import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './counter-control.module.scss';

export class CounterControl extends View {
  count: number;

  counter: ElementCreator;

  callback: (count: number) => void;

  constructor(callback: (count: number) => void) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.control],
    };
    super(params);
    this.count = 1;
    this.callback = callback;
    this.counter = new ElementCreator({
      tag: 'div',
      classNames: [styles.counter],
      textContent: `${this.count}`,
    });

    this.configureView();
  }

  private configureView(): void {
    const control: HTMLElement = this.getElement();

    const incrementElement: HTMLElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.button],
      textContent: '+',
      callback: [{ event: 'click', callback: this.incrementCounter.bind(this) }],
    }).getElement();

    const decrementElement: HTMLElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.button],
      textContent: '-',
      callback: [{ event: 'click', callback: this.decrementCounter.bind(this) }],
    }).getElement();

    control.append(decrementElement, this.counter.getElement(), incrementElement);
  }

  private incrementCounter(): void {
    this.count += 1;
    this.counter.getElement().textContent = `${this.count}`;
    this.callback(this.count);
  }

  private decrementCounter(): void {
    if (this.count > 0) {
      this.count -= 1;
    }
    this.counter.getElement().textContent = `${this.count}`;
    this.callback(this.count);
  }
}
