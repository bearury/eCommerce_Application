import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './accordion-button.module.scss';

export default class AccordionButton extends View {
  callback: () => void;

  icon: HTMLElement;

  constructor({ content, callback }: { content: string; callback: () => void }) {
    const params: ParamsElementCreator = {
      tag: 'button',
      classNames: [styles.accordionButton],
      callback: [{ event: 'click', callback: () => this.handleClick.call(this) }],
    };
    super(params);
    this.callback = callback;
    this.icon = new ElementCreator({ tag: 'span', classNames: [styles.icon] }).getElement();
    this.configureView(content);
  }

  private configureView(content: string): void {
    const title: HTMLElement = new ElementCreator({
      tag: 'span',
      classNames: [styles.title],
      textContent: content,
    }).getElement();

    this.getElement().append(this.icon, title);
  }

  private handleClick(): void {
    this.icon.classList.toggle(styles.active);
    this.callback();
  }
}
