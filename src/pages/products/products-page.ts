import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './products-page.module.scss';
import Router from '@router/router.ts';
import Container from '@components/container/container';
import InputTextField from '@components/input/input-field/input-password-field/input-text-field';
import { loaderState, productsDataState, toastState } from '@state/state.ts';
import ProductsApi from '@api/productsApi.ts';
import { apiInstance } from '@api/api.ts';
import { ProductsCard } from '@components/card/products-card/products-card';

export default class ProductsPage extends View {
  router: Router;

  container: HTMLElement;

  productsApi: ProductsApi;

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

    this.productsApi = new ProductsApi(apiInstance);
    productsDataState.subscribe(this.renderCards.bind(this));

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

    const button2 = new ElementCreator({
      tag: 'button',
      textContent: 'Get products',
      classNames: [styles.button],
      callback: [{ event: 'click', callback: this.handleClick2.bind(this) }],
    });

    wrapperInput.append(this.input.getElement(), button.getElement(), button2.getElement());

    this.container.append(wrapperInput);
  }

  private handleClick(): void {
    if (this.input.getValue()) {
      //TODO вызывется этот метод для перенаправления на страницу карточки товара, в аргументах передается ID карточки
      this.router.resourceNavigation(this.input.getValue());
    }
  }

  private async handleClick2(): Promise<void> {
    loaderState.getState().loader.show();
    await this.productsApi
      .get()
      .then((data) => {
        productsDataState.getState().setData(data);
      })
      .catch((error) => {
        if (error instanceof Error) {
          toastState.getState().toast.showError(error.message);
        }
      })
      .finally(() => {
        loaderState.getState().loader.close();
      });
  }

  private handleInput(): void {
    // this.router.resourceNavigation('2');
  }

  private renderCards() {
    const data = productsDataState.getState().data;

    const cardsContainer = new ElementCreator({ tag: 'div', classNames: [styles.cardContainer] }).getElement();

    console.log('✅: ', data);

    data?.body.results.forEach((product) => {
      const cardProduct = new ProductsCard(product).getElement();
      cardsContainer.append(cardProduct);
    });

    this.container.append(cardsContainer);
  }
}
