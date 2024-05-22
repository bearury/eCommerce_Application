import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './main-page.module.scss';
import Router from '@router/router.ts';
import { RouterPages } from '@app/app.ts';

export default class MainPage extends View {
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
    const mainPage: HTMLElement = this.getElement();

    const title: HTMLElement = new ElementCreator({
      tag: 'span',
      classNames: [styles.title],
      textContent: 'Main Page',
    }).getElement();

    const testButton: HTMLElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.button],
      textContent: 'Go Login Page',
      callback: [{ event: 'click', callback: this.handlerClickGoLogin.bind(this) }],
    }).getElement();

    const testButton2: HTMLElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.button],
      textContent: 'Go Registration Page',
      callback: [{ event: 'click', callback: this.handlerClickGoRegistration.bind(this) }],
    }).getElement();

    const container: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.container],
      children: [title, testButton, testButton2],
    }).getElement();
    mainPage.append(container);
  }

  private handlerClickGoLogin(): void {
    this.router.navigate(RouterPages.signin);
  }

  private handlerClickGoRegistration(): void {
    this.router.navigate(RouterPages.signup);
  }
}
