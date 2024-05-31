import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './not-found-page.module.scss';
import View from '@utils/view.ts';
import Router from '@router/router.ts';
import { RouterPages } from '@app/app.ts';

export default class NotFoundPage extends View {
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

  private handlerClickGoHome(): void {
    this.router.navigate(RouterPages.main);
  }

  private configureView(): void {
    const subtitle = new ElementCreator({
      tag: 'div',
      classNames: [styles.subtitle],
      textContent: 'Page not fount',
    });
    const title: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.title],
      textContent: '404',
    }).getElement();
    const block: HTMLElement = new ElementCreator({
      tag: 'div',
      children: [title, subtitle.getElement()],
    }).getElement();

    const button: HTMLElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.button],
      callback: [{ event: 'click', callback: this.handlerClickGoHome.bind(this) }],
      textContent: 'Go Home',
    }).getElement();

    this.getElement().append(block, button);
  }
}
