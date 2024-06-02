import { ParamsElementCreator } from '@utils/element-creator.ts';
import View from '@utils/view.ts';
import styles from './wrapper-pages.module.scss';
import HeaderPages from '@components/header-pages/header-pages';
import Router from '@router/router.ts';
import { toastState } from '@state/state.ts';
import Toast from '@components/toast/toast';
import Container from '@components/container/container';

export default class WrapperPages extends View {
  headerPages: HeaderPages;

  toast: Toast;

  container: HTMLElement;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.wrapper],
    };
    super(params);

    this.headerPages = new HeaderPages(router);
    this.toast = toastState.getState().toast;
    this.container = Container.get();
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

  private configureView() {
    const currentElement = this.getElement();
    currentElement.append(this.headerPages.getElement(), this.container, this.toast.getElement());
  }
}
