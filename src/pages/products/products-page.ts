import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './products-page.module.scss';
import Router from '@router/router.ts';
import { loaderState, productsDataState, toastState } from '@state/state.ts';
import ProductsApi from '@api/productsApi.ts';
import { apiInstance } from '@api/api.ts';
import { ProductsCard } from '@components/card/products-card/products-card';
import Pagination, { CellIconType } from '@components/pagination/pagination';
import { ClientResponse, ProductProjection, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import Accordion from '@pages/products/accordion/accordion';

export default class ProductsPage extends View {
  router: Router;

  accordion: Accordion;

  productsApi: ProductsApi;

  pagination: Pagination;

  cardsContainer: HTMLElement;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.products],
    };
    super(params);
    this.router = router;

    this.productsApi = new ProductsApi(apiInstance);
    productsDataState.subscribe(this.renderCards.bind(this));

    this.pagination = new Pagination((page: string) => this.handleChangePage.call(this, page));
    this.cardsContainer = new ElementCreator({ tag: 'div', classNames: [styles.cardContainer] }).getElement();
    this.accordion = new Accordion();
    this.configureView();
    this.getProductApi(productsDataState.getState().currentPage);
  }

  private configureView(): void {
    const content = new ElementCreator({
      tag: 'div',
      children: [this.cardsContainer, this.pagination.getElement()],
    }).getElement();
    this.getElement().append(this.accordion.getElement(), content);
  }

  private async getProductApi(page: number = 1): Promise<void> {
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

  private renderCards(): void {
    const data: ClientResponse<ProductProjectionPagedSearchResponse> | null = productsDataState.getState().data;
    this.cardsContainer.replaceChildren();

    console.log('[71] 🎯: ', data);

    if (data?.body.results.length) {
      this.pagination.setParams(data.body);
      data.body.results.forEach((product: ProductProjection): void => {
        const cardProduct: HTMLElement = new ProductsCard({
          data: product,
          callback: this.handleClickCard.bind(this),
        }).getElement();
        this.cardsContainer.append(cardProduct);
      });
    } else {
      const notFountElement = new ElementCreator({
        tag: 'div',
        classNames: [styles.notFound],
        textContent: 'Products not found',
      }).getElement();
      this.cardsContainer.append(notFountElement);
    }
  }

  private handleClickCard(id: string): void {
    this.router.resourceNavigation(id);
  }

  private handleChangePage(page: string): void {
    const currentPage: number = productsDataState.getState().currentPage;
    if (page === CellIconType.right) {
      this.getProductApi(Number(currentPage + 1));
      productsDataState.getState().setCurrentPage(currentPage + 1);
    } else if (page === CellIconType.left) {
      this.getProductApi(Number(currentPage - 1));
      productsDataState.getState().setCurrentPage(currentPage - 1);
    } else {
      this.getProductApi(Number(page));
      productsDataState.getState().setCurrentPage(Number(page));
    }
  }
}
