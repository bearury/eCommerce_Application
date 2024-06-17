import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './promocode-card_menu.module.scss';
import promocodeImg from '/promocode.png';
import { svgHtmlCopy } from '@components/svg/copy';
import { toastState } from '@state/state';

export class PromocodeBlock extends View {
  title: HTMLElement;

  desc: HTMLElement;

  input: HTMLElement;

  copyBtn: HTMLElement;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.promocodeContainer],
    };
    super(params);

    this.title = new ElementCreator({
      tag: 'div',
      classNames: [styles.title],
      textContent: 'The Best Sale Ever',
    }).getElement();

    this.desc = new ElementCreator({
      tag: 'div',
      classNames: [styles.desc],
      textContent: 'Get a -20% on the entire cart!',
    }).getElement();

    this.input = new ElementCreator({
      tag: 'input',
      classNames: [styles.input],
      attribute: [
        { type: 'readonly', value: 'true' },
        { type: 'value', value: 'light20' },
      ],
    }).getElement();

    this.copyBtn = new ElementCreator({
      tag: 'button',
      classNames: [styles.copyBtn],
      callback: [{ event: 'click', callback: this.copyPromocode.bind(this) }],
    }).getElement();

    this.configureView();
  }

  private copyPromocode() {
    const inputPromo = this.input as HTMLInputElement;
    navigator.clipboard.writeText(inputPromo.value);
    toastState.getState().toast.showSuccess('Copied!');
  }

  private configureView(): void {
    const promocodeContainer: HTMLElement = this.getElement();
    promocodeContainer.style.backgroundImage = `url(${promocodeImg})`;
    this.copyBtn.innerHTML = svgHtmlCopy;
    const promocodeInput = new ElementCreator({
      tag: 'div',
      classNames: [styles.promocodeInput],
      children: [this.input, this.copyBtn],
    }).getElement();

    promocodeContainer.append(this.title, this.desc, promocodeInput);
  }
}
