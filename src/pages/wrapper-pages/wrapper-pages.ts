import { ParamsElementCreator } from '@utils/element-creator.ts';
import View from '@utils/view.ts';
import styles from './wrapper-pages.module.scss';
import HeaderPages from '@components/header-pages/header-pages';
import Router from '@router/router.ts';
import { toastState } from '@state/state.ts';
import Toast from '@components/toast/toast';

export default class WrapperPages extends View {
  headerPages: HeaderPages;

  toast: Toast;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.wrapper],
    };
    super(params);

    this.headerPages = new HeaderPages(router);
    this.toast = toastState.getState().toast;
    this.configureView();
  }

  public setContent(view: View) {
    const childElement = view.getElement();
    const currentElement = this.getElement();

    if (currentElement.childNodes.length) {
      currentElement.childNodes.forEach((nodeElement: ChildNode) => {
        if (nodeElement === this.headerPages.getElement() || nodeElement === this.toast.getElement()) return;
        nodeElement.remove();
      });
    }

    this.elementCreator.element.append(childElement);
  }

  private configureView() {
    const currentElement = this.getElement();
    currentElement.append(this.headerPages.getElement(), this.toast.getElement());
  }
}
