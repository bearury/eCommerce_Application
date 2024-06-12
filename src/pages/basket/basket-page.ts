import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './basket-page.module.scss';
import Router from '@router/router.ts';
import { EmptyCart } from '@components/empty-cart/empty-cart';

export default class BasketPage extends View {
  router: Router;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
    };
    super(params);
    this.router = router;

    this.configureView();
  }

  private configureView(): void {
    const about = this.getElement();
    const emptyCart = new EmptyCart(this.router);

    about.append(emptyCart.getElement());
  }
}
