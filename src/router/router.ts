import { RouterPages } from '../app/app';
import HandlerRouter from './handler';

export type Route = { path: string; callback: Function };

export default class Router {
  routes: Array<Route>;

  handler: HandlerRouter;

  constructor(routes: Array<Route>) {
    this.routes = routes;
    this.handler = new HandlerRouter(this.urlChangedHandler.bind(this));
  }

  public redirectToNotFoundPage(): void {
    // const notFoundPage = this.routes.find((item) => item.path === RouterPages.not_found);
    // if (notFoundPage) {
    //   this.handler.navigate(notFoundPage.path);
    // }
  }

  public navigate(route: RouterPages) {
    const foundPage = this.routes.find((item) => item.path === route);
    if (foundPage) {
      this.handler.navigate(foundPage.path);
    }
  }

  private urlChangedHandler(requestParams: { path: string; resource: string }) {
    const pathForFind = requestParams.resource === '' ? requestParams.path : `${requestParams.path}/{id}`;
    const route = this.routes.find((item) => item.path === pathForFind);

    if (!route) {
      this.redirectToNotFoundPage();
    } else {
      route.callback(requestParams.resource);
    }
  }
}
