import { RouterPages } from '../app/app';
import HandlerRouter from './handler';
import { authState, categoryState, routerState } from '@state/state.ts';
import getPath from '@utils/get-path.ts';
import { getAncestorKeys } from '@utils/categories-formatter.ts';

export type Route = { path: string; callback: Function };

export default class Router {
  routes: Array<Route>;

  handler: HandlerRouter;

  constructor(routes: Array<Route>) {
    this.routes = routes;
    this.handler = new HandlerRouter(this.urlChangedHandler.bind(this));
    categoryState.subscribe(() => this.handleCategoriesChange());
  }

  public resourceNavigation(id: string): void {
    this.handler.navigate(RouterPages.product, id);
    routerState.getState().setPage(RouterPages.product);
  }

  public redirectToNotFoundPage(): void {
    const notFoundPage = this.routes.find((item) => item.path === RouterPages.not_found);
    if (notFoundPage) {
      this.handler.navigate(RouterPages.not_found);
    }
  }

  public navigate(route: RouterPages): void {
    const foundPage: Route | undefined = this.routes.find((item: Route): boolean => item.path === route);

    console.log('[33] 🍄: ', route);

    if (!foundPage) return;
    const path: RouterPages | undefined = getPath(foundPage.path);

    if (path) {
      routerState.getState().setPage(path);
      this.handler.navigate(path);
    }

    if (
      (authState.getState().isAuthorized && (route === RouterPages.signin || route === RouterPages.signup)) ||
      (!authState.getState().isAuthorized && route === RouterPages.profile)
    ) {
      this.handler.navigate(RouterPages.main);
    }
  }

  private handleCategoriesChange(): void {
    const path = getAncestorKeys(categoryState.getState().categories, categoryState.getState().category as string).join(
      '/'
    );

    console.log('🖌: ', path);

    const fillPath = `${RouterPages.products}/${path}`;

    if (path.length) {
      this.handler.navigateForCategories(fillPath);
    }
  }

  private urlChangedHandler(requestParams: { path: string; resource: string }): void {
    const pathForFind: string = requestParams.resource === '' ? requestParams.path : `${requestParams.path}/{id}`;
    const route: Route | undefined = this.routes.find((item: Route): boolean => item.path === pathForFind);

    if (!route) {
      this.redirectToNotFoundPage();
    } else {
      route.callback(requestParams.resource);
    }
  }
}
