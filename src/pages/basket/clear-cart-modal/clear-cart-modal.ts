import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './clear-cart-modal.module.scss';
import CartApi from '@api/cartApi';
import { apiInstance } from '@api/api';

export class ClearCartModal extends View {
  label: HTMLElement;

  yesBtn: HTMLElement;

  noBtn: HTMLElement;

  btnBlock: HTMLElement;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.modalWrapper],
    };
    super(params);

    this.label = new ElementCreator({
      tag: 'div',
      classNames: [styles.label],
      textContent: 'Are you sure you want to delete the shopping cart?',
    }).getElement();

    this.yesBtn = new ElementCreator({
      tag: 'button',
      classNames: [styles.btn],
      textContent: 'Yes',
      callback: [{ event: 'click', callback: this.clearCart.bind(this) }],
    }).getElement();

    this.noBtn = new ElementCreator({
      tag: 'button',
      classNames: [styles.btn],
      textContent: 'No',
      callback: [{ event: 'click', callback: this.closeModal.bind(this) }],
    }).getElement();

    this.btnBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.btnBlock],
      children: [this.yesBtn, this.noBtn],
    }).getElement();

    this.configureView();
  }

  public async clearCart() {
    const cartId = localStorage.getItem('cartId');

    if (!cartId) {
      throw new Error('No cart id!');
    }
    const response = await new CartApi(apiInstance).deleteCart(cartId);
    if (response && response.statusCode === 200) {
      console.log('del', response.body.lineItems);
    } else {
      this.closeModal();
    }
    this.closeModal();
  }

  private closeModal() {
    document.body.removeChild(this.getElement());
  }

  private configureView(): void {
    const modalWrapper: HTMLElement = this.getElement();
    const modal: ElementCreator = new ElementCreator({ tag: 'section', classNames: [styles.modal] });
    modal.getElement().append(this.label, this.btnBlock);
    modalWrapper.append(modal.getElement());
  }
}
