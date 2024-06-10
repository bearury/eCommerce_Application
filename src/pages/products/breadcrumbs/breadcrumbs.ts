import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './breadcrumbs.module.scss';
import { categoryState, loaderState, productsState, toastState } from '@state/state.ts';
import { getAncestorCategories } from '@utils/categories-formatter.ts';
import { ModifyCategory } from '@utils/categories-creator.ts';
import ProductsApi from '@api/productsApi.ts';
import { apiInstance } from '@api/api.ts';
import Router from '@router/router.ts';

export type ButtonsGroupType = 'Apply' | 'Cancel';

export class Breadcrumbs extends View {
  productsApi: ProductsApi;

  router: Router;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.breadcrumbs],
    };
    super(params);
    this.router = router;
    categoryState.subscribe(() => this.handleRender.call(this));
    this.productsApi = new ProductsApi(apiInstance);

    this.handleRender();
  }

  private handleRender(): void {
    const categories: ModifyCategory[] | [] = categoryState.getState().categories;
    const category: string | null = categoryState.getState().category;

    if (category) {
      const arrPaths: ModifyCategory[] = getAncestorCategories(categories, category);

      this.getElement().replaceChildren();

      arrPaths.forEach((el: ModifyCategory, i) => {
        const elCrumb: HTMLElement = new ElementCreator({
          tag: 'span',
          textContent: el.name,
          callback: [{ event: 'click', callback: () => this.handleClickCrumb.call(this, el.id) }],
          classNames: [styles.crumb],
        }).getElement();
        if (i > 0) {
          const separator: HTMLElement = new ElementCreator({
            tag: 'span',
            textContent: '>',
            classNames: [styles.separator],
          }).getElement();
          this.getElement().append(separator);
        }

        this.getElement().append(elCrumb);
      });
    }
  }

  private async handleClickCrumb(id: string): Promise<void> {
    categoryState.getState().setCategory(id);
    this.router.categoryChange();
    loaderState.getState().loader.show();
    const defaultPage = 1;
    await this.productsApi
      .get(defaultPage)
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
}
