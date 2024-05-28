import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './products-page.module.scss';
import Router from '@router/router.ts';
import Container from '@components/container/container';
import InputTextField from '@components/input/input-field/input-password-field/input-text-field';

export default class ProductsPage extends View {
  router: Router;

  container: HTMLElement;

  //TODO временный инпут для проверки
  input: InputTextField;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.products],
    };
    super(params);
    this.router = router;
    this.container = Container.get();
    this.getElement().append(this.container);

    //TODO временный инпут для проверки
    this.input = new InputTextField({ name: 'Введите ID карточки', callback: this.handleInput });
    // --------->

    this.configureView();
  }

  private configureView(): void {
    //TODO временный инпут для проверки
    const wrapperInput = new ElementCreator({ tag: 'div', classNames: [styles.wrapperInput] }).getElement();

    const button = new ElementCreator({
      tag: 'button',
      textContent: 'Button',
      classNames: [styles.button],
      callback: [{ event: 'click', callback: this.handleClick.bind(this) }],
    });

    wrapperInput.append(this.input.getElement(), button.getElement());

    this.container.append(wrapperInput);
  }

  private handleClick(): void {
    if (this.input.getValue()) {
      //TODO вызывется этот метод для перенаправления на страницу карточки товара, в аргументах передается ID карточки
      this.router.resourceNavigation(this.input.getValue());
    }
  }

  private handleInput(): void {
    // this.router.resourceNavigation('2');
  }
}
