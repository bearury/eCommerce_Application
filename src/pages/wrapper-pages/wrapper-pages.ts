import { ParamsElementCreator } from '@utils/element-creator.ts';
import View from '@utils/view.ts';
import styles from './wrapper-pages.module.scss';
import HeaderPages from '@components/header-pages/header-pages';
import Router from '@router/router.ts';
import { categoryState, toastState } from '@state/state.ts';
import Toast from '@components/toast/toast';
import Container from '@components/container/container';
import CategoriesApi from '@api/categoriesApi.ts';
import { apiInstance } from '@api/api.ts';
import { CategoryPagedQueryResponse, ClientResponse } from '@commercetools/platform-sdk';
import { categoriesCreator, ModifyCategory } from '@utils/categories-creator.ts';
import { getCategoryByKey } from '@utils/categories-formatter.ts';

export default class WrapperPages extends View {
  headerPages: HeaderPages;

  toast: Toast;

  container: HTMLElement;

  categoriesApi: CategoriesApi;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.wrapper],
    };
    super(params);

    this.headerPages = new HeaderPages(router);
    this.toast = toastState.getState().toast;
    this.container = Container.get();
    this.categoriesApi = new CategoriesApi(apiInstance);
    this.configureView();
  }

  public setContent(view: View) {
    const childElement = view.getElement();

    if (this.container.childNodes.length) {
      this.container.childNodes.forEach((nodeElement: ChildNode) => {
        nodeElement.remove();
      });
    }

    this.container.append(childElement);
  }

  private async configureView(): Promise<void> {
    const currentElement: HTMLElement = this.getElement();

    await this.categoriesApi.get().then((data: ClientResponse<CategoryPagedQueryResponse>) => {
      const modifyCategories: ModifyCategory[] = categoriesCreator(data);
      categoryState.getState().setCategories(modifyCategories);
      const path = window.location.pathname.slice(1).split('/');
      const lastElement = path[path.length - 1];
      const checkCategories: ModifyCategory | undefined = getCategoryByKey(modifyCategories, lastElement);

      if (checkCategories) {
        categoryState.getState().setCategory(checkCategories.id);
      } else {
        categoryState.getState().setCategory(modifyCategories[0].id);
      }

      currentElement.append(this.headerPages.getElement(), this.container, this.toast.getElement());
    });
  }
}
