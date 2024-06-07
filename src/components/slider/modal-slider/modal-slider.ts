import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './modal-slider.module.scss';
import { Slider } from '../slider';

export class ModalSlider extends View {
  modalHeader: HTMLElement;

  closeBtn: HTMLElement;

  sliderBlock: HTMLElement;

  constructor(slider: Slider) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.modalWrapper],
    };
    super(params);

    this.closeBtn = new ElementCreator({
      tag: 'div',
      classNames: [styles.closeBtn],
      textContent: 'close',
      callback: [{ event: 'click', callback: this.closeModal.bind(this) }],
    }).getElement();

    this.modalHeader = new ElementCreator({
      tag: 'div',
      classNames: [styles.modalHeader],
      children: [this.closeBtn],
    }).getElement();

    this.sliderBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.sliderBlock],
      children: [slider.getElement()],
    }).getElement();

    this.configureView();
  }

  private closeModal() {
    document.body.removeChild(this.getElement());
  }

  private configureView(): void {
    const modalWrapper: HTMLElement = this.getElement();
    const modal: ElementCreator = new ElementCreator({ tag: 'section', classNames: [styles.modal] });
    modal.getElement().append(this.modalHeader, this.sliderBlock);
    modalWrapper.append(modal.getElement());
  }
}
