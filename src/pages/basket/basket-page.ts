import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './basket-page.module.scss';
import Router from '@router/router.ts';
import Image from '@components/image/image';
import emptyCart from '/empty-cart.png';

export default class BasketPage extends View {
  emptyCartBlock: HTMLElement;

  router: Router;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
    };
    super(params);
    this.router = router;

    this.emptyCartBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.emptyCartBlock],
    }).getElement();

    this.configureView();
  }

  private configureView(): void {
    const about = this.getElement();
    const cartImage = new Image({ classNames: [styles.image], img: emptyCart }).getElement();
    const emptyCartMsg = new ElementCreator({
      tag: 'div',
      classNames: [styles.emptyCartMsg],
      textContent: 'Your cart is empty!',
    }).getElement();
    const emptyCartMsgLink = new ElementCreator({
      tag: 'div',
      classNames: [styles.emptyCartMsgLink],
      textContent: 'Looks like you have not added anything to your cart...',
    }).getElement();

    this.emptyCartBlock.append(cartImage, emptyCartMsg, emptyCartMsgLink);
    about.append(this.emptyCartBlock);
  }
}
