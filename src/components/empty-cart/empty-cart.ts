import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './empty-cart.module.scss';
import Router from '@router/router.ts';
import Image from '@components/image/image';
import emptyCart from '/empty-cart.png';
import { RouterPages } from '@app/app';

export class EmptyCart extends View {
  router: Router;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.emptyCartBlock],
    };
    super(params);
    this.router = router;

    this.configureView();
  }

  private configureView(): void {
    const emptyCartBlock = this.getElement();

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
    const emptyCartBtn = new ElementCreator({
      tag: 'button',
      classNames: [styles.emptyCartBtn],
      textContent: 'Go Shopping!',
      callback: [{ event: 'click', callback: this.handlerClickGoProductsCatalog.bind(this) }],
    }).getElement();

    emptyCartBlock.append(cartImage, emptyCartMsg, emptyCartMsgLink, emptyCartBtn);
  }

  private handlerClickGoProductsCatalog(): void {
    this.router.navigate(RouterPages.products);
  }
}
