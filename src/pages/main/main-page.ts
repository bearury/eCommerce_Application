import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './main-page.module.scss';
import Router from '@router/router.ts';
import { RouterPages } from '@app/app.ts';
import ProductsApi from '@api/productsApi.ts';
import { apiInstance } from '@api/api.ts';
import { PromocodeBlock } from '@components/card/promocode-card/promocode-card_menu/promocode-card_menu';

export default class MainPage extends View {
  router: Router;

  api: ProductsApi;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
    };
    super(params);
    this.router = router;
    this.api = new ProductsApi(apiInstance);
    this.configureView();
  }

  private configureView(): void {
    const mainPage: HTMLElement = this.getElement();

    const title: HTMLElement = new ElementCreator({
      tag: 'div',
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

    const testButton3: HTMLElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.button],
      textContent: 'Go Profile Page',
      callback: [{ event: 'click', callback: this.handlerClickGoProfilePage.bind(this) }],
    }).getElement();

    const buttonsContainer: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.buttonsContainer],
      children: [testButton, testButton2, testButton3],
    }).getElement();

    const promocodeContainer: HTMLElement = new PromocodeBlock().getElement();

    const wrapperContainer: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.wrapperContainer],
      children: [promocodeContainer, buttonsContainer],
    }).getElement();

    mainPage.append(title, wrapperContainer);
  }

  private handlerClickGoLogin(): void {
    this.router.navigate(RouterPages.signin);
  }

  private handlerClickGoRegistration(): void {
    this.router.navigate(RouterPages.signup);
  }

  private handlerClickGoProfilePage(): void {
    this.router.navigate(RouterPages.profile);
  }
}
