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
import Pagination from '@components/pagination/pagination';
import { ClientResponse, Product, ProductPagedQueryResponse } from '@commercetools/platform-sdk';

export default class ProductsPage extends View {
  router: Router;

  container: HTMLElement;

  productsApi: ProductsApi;

  pagination: Pagination;

  cardsContainer: HTMLElement;

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

    this.pagination = new Pagination((page: string) => this.handleChangePage.call(this, page));
    this.cardsContainer = new ElementCreator({ tag: 'div', classNames: [styles.cardContainer] }).getElement();

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
      callback: [{ event: 'click', callback: () => this.handleClick2.call(this, 1) }],
    });

    wrapperInput.append(this.input.getElement(), button.getElement(), button2.getElement());

    this.container.append(wrapperInput, this.cardsContainer, this.pagination.getElement());
  }

  private handleClick(): void {
    if (this.input.getValue()) {
      //TODO вызывется этот метод для перенаправления на страницу карточки товара, в аргументах передается ID карточки
      this.router.resourceNavigation(this.input.getValue());
    }
  }

  private async handleClick2(page: number = 1): Promise<void> {
    loaderState.getState().loader.show();

    await this.productsApi
      .get(page)
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

  private renderCards(): void {
    const data: ClientResponse<ProductPagedQueryResponse> | null = productsDataState.getState().data;

    console.log('✅: ', data);

    this.cardsContainer.replaceChildren();

    if (data) {
      this.pagination.setParams(data.body);
      data.body.results.forEach((product: Product): void => {
        const cardProduct: HTMLElement = new ProductsCard(product).getElement();
        this.cardsContainer.append(cardProduct);
      });
    }
  }

  private handleChangePage(page: string): void {
    const offset = productsDataState.getState().data?.body.offset as number;
    const activePage = offset / 10;

    if (page === '\u25BA') {
      this.handleClick2(Number(activePage + 1));
    } else if (page === '\u25C0') {
      this.handleClick2(Number(activePage - 1));
    } else {
      this.handleClick2(Number(page));
    }
  }
}
