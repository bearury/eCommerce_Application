import styles from './toast.module.scss';
import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';

export type ToastType = ToastTypes;

export const enum ToastTypes {
  INFO = 'info',
  ERROR = 'error',
  WARNING = 'warning',
}

export default class Toast extends View {
  toast: ElementCreator;

  progressBar: ElementCreator;

  timer1: ReturnType<typeof setTimeout> | null;

  timer2: ReturnType<typeof setTimeout> | null;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.toast],
    };
    super(params);

    this.toast = this.elementCreator;
    this.progressBar = new ElementCreator({
      tag: 'div',
      classNames: [styles.progress],
    });

    this.timer1 = null;
    this.timer2 = null;
  }

  public showError(message: string) {
    this.configureView(ToastTypes.ERROR, message);
    this.show();
  }

  public showSuccess(message: string) {
    this.configureView(ToastTypes.INFO, message);
    this.show();
  }

  private show(): void {
    clearTimeout(this.timer1!);
    clearTimeout(this.timer2!);
    this.toast.getElement().classList.remove(styles.active);
    this.progressBar.getElement().classList.remove(styles.active);
    this.toast.getElement().classList.add(styles.active);
    this.progressBar.getElement().classList.add(styles.active);

    this.timer1 = setTimeout(() => {
      this.toast.getElement().classList.remove(styles.active);
    }, 5000);

    this.timer2 = setTimeout(() => {
      this.toast.getElement().classList.remove(styles.active);
      this.progressBar.getElement().classList.remove(styles.active);
    }, 5300);
  }

  private handlerClickCloseBtn(): void {
    this.toast.getElement().classList.remove(styles.active);

    setTimeout(() => {
      this.progressBar.getElement().classList.remove(styles.active);
    }, 300);

    clearTimeout(this.timer1!);
    clearTimeout(this.timer2!);
  }

  private configureView(type: ToastType, text: string): void {
    this.toast.getElement().replaceChildren();
    const content: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.content],
    }).getElement();

    const point: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.point, styles[type]],
      textContent: '!',
    }).getElement();

    const title: string = type === ToastTypes.INFO ? 'Success' : type === ToastTypes.WARNING ? 'warning' : 'error';

    this.progressBar.getElement().className = '';
    this.progressBar.getElement().classList.add(styles.progress, styles[type]);

    const message: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.message],
      children: [
        new ElementCreator({
          tag: 'span',
          classNames: [styles.text, styles.text1],
          textContent: title,
        }).getElement(),
        new ElementCreator({
          tag: 'span',
          classNames: [styles.text, styles.text2],
          textContent: text,
        }).getElement(),
      ],
    }).getElement();

    const closeBtn: ElementCreator = new ElementCreator({
      tag: 'button',
      classNames: [styles.closeBtn, styles[type]],
      textContent: 'Close',
      callback: [{ event: 'click', callback: this.handlerClickCloseBtn.bind(this) }],
    });

    content.append(point, message);

    this.toast.getElement().append(content, this.progressBar.getElement(), closeBtn.getElement());
  }
}
