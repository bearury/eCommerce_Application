import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './promocode-card_basket.module.scss';
import promocodeImg from '/promocode-cart.png';
import CartApi from '@api/cartApi';
import { apiInstance } from '@api/api';

const promo = 'light20';

export class PromocodeBlockBasket extends View {
  input: HTMLElement;

  applyBtn: HTMLElement;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.promocodeContainer],
    };
    super(params);

    this.input = new ElementCreator({
      tag: 'input',
      classNames: [styles.input],
      attribute: [{ type: 'placeholder', value: 'Enter a promocode' }],
      callback: [{ event: 'input', callback: this.changeInputValue.bind(this) }],
    }).getElement();

    this.applyBtn = new ElementCreator({
      tag: 'button',
      classNames: [styles.applyBtn],
      textContent: 'Apply',
      attribute: [{ type: 'disabled', value: 'true' }],
      callback: [{ event: 'click', callback: this.copyPromocode.bind(this) }],
    }).getElement();

    this.configureView();
  }

  private changeInputValue() {
    const inputPromo = this.input as HTMLInputElement;
    if (inputPromo.value.length > 0) {
      this.applyBtn.removeAttribute('disabled');
    } else {
      if (this.applyBtn.hasAttribute('disabled') === false) {
        this.applyBtn.setAttribute('disabled', 'true');
      }
    }
  }

  private async copyPromocode() {
    const inputPromo = this.input as HTMLInputElement;
    if (inputPromo.value === promo) {
      console.log('right promo code');
    }

    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      throw new Error('No cart id!');
    }
    const response = await new CartApi(apiInstance).addDiscount(cartId, inputPromo.value);
    if (response && response.statusCode === 200) {
      console.log(response);
      this.input.setAttribute('disabled', 'true');
      this.applyBtn.setAttribute('disabled', 'true');
    }
  }

  private configureView(): void {
    const promocodeContainer: HTMLElement = this.getElement();
    promocodeContainer.style.backgroundImage = `url(${promocodeImg})`;

    promocodeContainer.append(this.input, this.applyBtn);
  }
}
