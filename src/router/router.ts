import { RouterPages } from '../app/app';
import HandlerRouter from './handler';
import { authState, categoryState, routerState } from '@state/state.ts';
import getPath from '@utils/get-path.ts';
import { getAncestorCategories } from '@utils/categories-formatter.ts';
import { ModifyCategory } from '@utils/categories-creator.ts';

export type Route = { path: string; callback: Function };

export default class Router {
  routes: Array<Route>;

  handler: HandlerRouter;

  constructor(routes: Array<Route>) {
    this.routes = routes;
    this.handler = new HandlerRouter(this.urlChangedHandler.bind(this));
    // categoryState.subscribe(() => this.handleCategoriesChange());
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

  public categoryChange(): void {
    const lineArrActiveCategories: ModifyCategory[] = getAncestorCategories(
      categoryState.getState().categories,
      categoryState.getState().category as string
    );

    const appPath: string = lineArrActiveCategories.map((cat: ModifyCategory) => cat.key).join('/');
    const fullPath: string = `${RouterPages.products}/${appPath}`;

    if (appPath.length) {
      this.handler.navigateForCategories(fullPath);
    }
  }

  private urlChangedHandler(requestParams: { path: string; resource: string }): void {
    if (requestParams.path === RouterPages.products) {
      const route: Route | undefined = this.routes.find((item: Route): boolean => item.path === RouterPages.products);
      route?.callback();
      return;
    }

    const pathForFind: string = requestParams.resource === '' ? requestParams.path : `${requestParams.path}/{id}`;
    const route: Route | undefined = this.routes.find((item: Route): boolean => item.path === pathForFind);

    if (!route) {
      this.redirectToNotFoundPage();
    } else {
      route.callback(requestParams.resource);
    }
  }
}
