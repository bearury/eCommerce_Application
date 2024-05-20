import { RouterPages } from '../app/app';
import { authState, routerState } from '@state/state.ts';
import getPath from '@utils/get-path.ts';

export default class HandlerRouter {
  private readonly callback: (requestParams: { path: string; resource: string }) => void;

  constructor(callback: (requestParams: { path: string; resource: string }) => void) {
    this.callback = callback;

    window.addEventListener('popstate', this.handleRoutePopState.bind(this));
    window.addEventListener('load', () => {
      const path: string = window.location.pathname.slice(1);
      const foundPath: RouterPages | null = getPath(path);
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
    console.log('[33] 🍄: ', event, authState.getState().isAuthorized);

    const arrPath = event.split('/');
    if (arrPath.length === 1) {
      this.callback({ path: arrPath[0], resource: '' });
      this.setHistory(arrPath[0]);
    } else {
      const urlString = window.location.pathname.slice(1);
      const result = { path: '', resource: '' };
      [result.path = '', result.resource = ''] = urlString.split('/');

      this.setHistory(event);
      this.callback(result);
    }
  }

  private handleRoutePopState(): void {
    const historyPath = window.location.pathname.split('/')[1];
    if (historyPath) {
      this.callback({ path: historyPath, resource: '' });
      this.setHistory(historyPath);
    }
  }

  private setHistory(url: string): void {
    window.history.pushState(null, '', `/${url}`);
  }
}
