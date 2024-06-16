import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './products-page.module.scss';
import Router from '@router/router.ts';
import { loaderState, pageState, productsState, toastState } from '@state/state.ts';
import ProductsApi from '@api/productsApi.ts';
import { apiInstance, projectKey } from '@api/api.ts';
import { ProductsCard } from '@components/card/products-card/products-card';
import Pagination, { CellIconType } from '@components/pagination/pagination';
import { ClientResponse, ProductProjection, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import Accordion from '@pages/products/accordion/accordion';
import CategoriesSelect from '@pages/products/categories-select/categories-select';
import { Breadcrumbs } from '@pages/products/breadcrumbs/breadcrumbs';
import SortingBlock from './sorting/sorting';
import SearchingField from './searching/searching';
import CartApi from '@api/cartApi.ts';

export default class ProductsPage extends View {
  router: Router;

  sortingBlock: HTMLElement;

  searchingBlock: HTMLElement;

  accordion: Accordion;

  productsApi: ProductsApi;

  pagination: Pagination;

  cardsContainer: HTMLElement;

  categories: CategoriesSelect;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.products],
    };
    super(params);
    this.router = router;

    this.productsApi = new ProductsApi(apiInstance);
    productsState.subscribe(this.renderCards.bind(this));

    this.searchingBlock = new SearchingField().getElement();
    this.sortingBlock = new SortingBlock().getElement();
    this.pagination = new Pagination((page: string) => this.handleChangePage.call(this, page));
    this.cardsContainer = new ElementCreator({ tag: 'div', classNames: [styles.cardContainer] }).getElement();
    this.accordion = new Accordion();
    this.categories = new CategoriesSelect(this.router);
    this.configureView();
    this.getProductApi();
  }

  private configureView(): void {
    const content = new ElementCreator({
      tag: 'div',
      children: [this.cardsContainer, this.pagination.getElement()],
    }).getElement();

    const breadcrumbs: HTMLElement = new Breadcrumbs(this.router).getElement();
    this.getElement().append(
      breadcrumbs,
      this.searchingBlock,
      this.sortingBlock,
      this.accordion.getElement(),
      this.categories.getElement(),
      content
    );
  }

  private async getProductApi(): Promise<void> {
    loaderState.getState().loader.show();
    const page = pageState.getState().currentPage;
    await this.productsApi
      .get(page)
      .then((data) => {
        productsState.getState().setData(data);
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

  private async renderCards(): Promise<void> {
    const data: ClientResponse<ProductProjectionPagedSearchResponse> | null = productsState.getState().data;
    const productInCart = await this.getProductsInCart();
    this.cardsContainer.replaceChildren();

    console.log('🆘: RENDER CARDS', data);

    if (data?.body.results.length) {
      this.pagination.setParams(data.body);
      data.body.results.forEach((product: ProductProjection): void => {
        const cardProduct: HTMLElement = new ProductsCard({
          data: product,
          callback: this.handleClickCard.bind(this),
          addToCartCallback: this.addToCartCallback,
          buttonValue: productInCart.includes(product.id) ? 'In cart ✅' : 'Add to cart 🛒',
          isDisabledButton: productInCart.includes(product.id) ? true : false,
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
    console.log();
    this.router.resourceNavigation(id);
  }

  private handleChangePage(page: string): void {
    const currentPage: number = pageState.getState().currentPage;

    if (page === CellIconType.right) {
      pageState.getState().setCurrentPage(currentPage + 1);
    } else if (page === CellIconType.left) {
      pageState.getState().setCurrentPage(currentPage - 1);
    } else {
      pageState.getState().setCurrentPage(Number(page));
    }
    this.getProductApi();
  }

  private async addToCartCallback(productId: string, button: HTMLButtonElement): Promise<void> {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      throw new Error('No cart id!');
    }
    const response = await new CartApi(apiInstance).addToCart(cartId, productId);
    if (response && response.statusCode === 200) {
      button.value = 'In cart ✅';
      button.disabled = true;
    }
  }

  private async getProductsInCart(): Promise<string[]> {
    const response = await apiInstance.getClient().withProjectKey({ projectKey }).me().activeCart().get().execute();
    const productsInCartIds: string[] = response.body.lineItems.map((product) => product.productId);
    return productsInCartIds;
  }
}
