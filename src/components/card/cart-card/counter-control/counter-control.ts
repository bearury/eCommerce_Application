import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './counter-control.module.scss';

export class CounterControl extends View {
  count: number;

  counter: ElementCreator;

  incrementElement: ElementCreator;

  decrementElement: ElementCreator;

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

    this.incrementElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.button],
      textContent: '+',
      callback: [{ event: 'click', callback: this.incrementCounter.bind(this) }],
    });

    this.decrementElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.button],
      textContent: '-',
      callback: [{ event: 'click', callback: this.decrementCounter.bind(this) }],
    });

    this.configureView();
  }

  public setValueCount(count: number): void {
    this.count = count;
    this.counter.getElement().textContent = `${count}`;
  }

  public disable(): void {
    this.incrementElement.getElement().setAttribute('disabled', 'true');
    this.decrementElement.getElement().setAttribute('disabled', 'true');
  }

  public undisable(): void {
    this.incrementElement.getElement().removeAttribute('disabled');
    this.decrementElement.getElement().removeAttribute('disabled');
  }

  private configureView(): void {
    const control: HTMLElement = this.getElement();

    control.append(this.decrementElement.getElement(), this.counter.getElement(), this.incrementElement.getElement());
  }

  private incrementCounter(): void {
    this.count += 1;
    this.callback(this.count);
  }

  private decrementCounter(): void {
    if (this.count > 0) {
      this.count -= 1;
    }
    this.callback(this.count);
  }
}
