import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './products-page.module.scss';
import Router from '@router/router.ts';
import Container from '@components/container/container';

export default class ProductsPage extends View {
  router: Router;

  container: HTMLElement;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.products],
    };
    super(params);
    this.router = router;
    this.container = Container.get();
    this.getElement().append(this.container);
    this.configureView();
  }

  private configureView(): void {
    const button = new ElementCreator({
      tag: 'button',
      textContent: 'Button',
      callback: [{ event: 'click', callback: this.handleClick.bind(this) }],
    });

    const button2 = new ElementCreator({
      tag: 'button',
      textContent: 'Button',
      callback: [{ event: 'click', callback: this.handleClick2.bind(this) }],
    });

    this.container.append(button.getElement(), button2.getElement());
  }

  private handleClick(): void {
    this.router.resourceNavigation('1');
  }

  private handleClick2(): void {
    this.router.resourceNavigation('2');
  }
}
