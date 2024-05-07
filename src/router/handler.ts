import { RouterPages } from '../app/app';

export default class HandlerRouter {
  private readonly callback: (requestParams: { path: string; resource: string }) => void;

  constructor(callback: (requestParams: { path: string; resource: string }) => void) {
    this.callback = callback;

    window.addEventListener('popstate', this.handleRoutePopState.bind(this));
    window.addEventListener('load', () => {
      const path = window.location.pathname.slice(1);
      if (path) {
        this.navigate(path);
        return;
      }
      this.navigate(RouterPages.main);
    });
  }

  public navigate<T extends string | RouterPages>(event: T): void {
    const arrPath = event.split('/');
    if (arrPath.length === 1) {
      this.callback({ path: arrPath[0], resource: '' });
      this.setHistory(arrPath[0]);
    } else {
      const urlString = window.location.pathname.slice(1);
      const result = { path: '', resource: '' };
      [result.path = '', result.resource = ''] = urlString.split('/');
      if (typeof event === 'string') {
        this.setHistory(event);
      }
      this.callback(result);
    }
  }

  private handleRoutePopState() {
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
