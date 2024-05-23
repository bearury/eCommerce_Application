import { RouterPages } from '../app/app';
import { authState, routerState } from '@state/state.ts';
import getPath from '@utils/get-path.ts';

const enum NavigationDirection {
  forward = 'forward',
  backward = 'backward',
}

export default class HandlerRouter {
  private readonly callback: (requestParams: { path: string; resource: string }) => void;

  constructor(callback: (requestParams: { path: string; resource: string }) => void) {
    this.callback = callback;

    window.addEventListener('popstate', (e: PopStateEvent) => this.handleRoutePopState.call(this, e));
    window.addEventListener('load', () => {
      const path: string = window.location.pathname.slice(1);
      const foundPath: RouterPages | null = getPath(path);

      if (authState.getState().isAuthorized && path === RouterPages.signin) {
        this.navigate(RouterPages.main);
        routerState.getState().setPage(RouterPages.main);
        return;
      }

      if (foundPath) {
        this.navigate(foundPath);
        routerState.getState().setPage(foundPath);
        return;
      }

      if (!path) {
        this.navigate(RouterPages.main);
        routerState.getState().setPage(RouterPages.main);
        return;
      }

      this.navigate(RouterPages.not_found);
      routerState.getState().setPage(RouterPages.not_found);
    });
  }

  public navigate<T extends RouterPages>(event: T): void {
    const arrPath = event.split('/');

    if (arrPath.length === 1) {
      this.callback({ path: arrPath[0], resource: '' });
      this.setHistory(arrPath[0], NavigationDirection.forward);
    } else {
      const urlString = window.location.pathname.slice(1);
      const result = { path: '', resource: '' };
      [result.path = '', result.resource = ''] = urlString.split('/');

      this.setHistory(event, NavigationDirection.forward);
      this.callback(result);
    }

    if (authState.getState().isAuthorized && event === RouterPages.signin) {
      this.callback({ path: RouterPages.main, resource: '' });
      this.setHistory(RouterPages.main, NavigationDirection.forward);
      routerState.getState().setPage(RouterPages.main);
      return;
    }
  }

  private handleRoutePopState(e: PopStateEvent): void {
    const historyPath = window.location.pathname.split('/')[1];

    const state = e.state || {};
    const direction = state.direction || NavigationDirection.backward;

    if (authState.getState().isAuthorized && historyPath === RouterPages.signin) {
      if (direction === NavigationDirection.forward) {
        window.history.replaceState({ direction: NavigationDirection.backward }, '', `/${historyPath}`);
        window.history.go(-1);
      } else {
        window.history.replaceState({ direction: NavigationDirection.forward }, '', `/${historyPath}`);
        window.history.go(1);
      }
      return;
    }

    if (historyPath) {
      this.callback({ path: historyPath, resource: '' });
      const route = getPath(historyPath);
      if (route) routerState.getState().setPage(route);
    }
  }

  private setHistory(url: string, direction: NavigationDirection): void {
    window.history.pushState({ direction }, '', `/${url}`);
  }
}
