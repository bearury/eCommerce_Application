import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './products-page.module.scss';
import Router from '@router/router.ts';

export default class ProductsPage extends View {
  router: Router;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.products],
    };
    super(params);
    this.router = router;
    this.configureView();
  }

  private configureView(): void {
    const productsPage: HTMLElement = this.getElement();
    productsPage.textContent = 'Products Page --------->';
  }
}
