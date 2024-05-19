import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './header-pages.module.scss';
import HeaderButton from '@components/buttons/header-button/header-button';
import { RouterPages } from '@app/app.ts';
import Router from '@router/router.ts';
import Image from '@components/image/image';
import img from '/logo.png';

export default class HeaderPages extends View {
  router: Router;

  buttons: HeaderButton[];

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'header',
      classNames: [styles.header],
    };
    super(params);
    this.router = router;

    this.buttons = [];
    this.configureView();
  }

  private configureView(): void {
    const currentElement: HTMLElement = this.getElement();
    const container: HTMLElement = new ElementCreator({ tag: 'div', classNames: [styles.container] }).getElement();

    const blockButton: HTMLElement = new ElementCreator({ tag: 'div', classNames: [styles.blockButton] }).getElement();

    const buttons: RouterPages[] = Object.values(RouterPages);

    const image: Image = new Image({ classNames: [styles.image], img });

    buttons.forEach((btn: RouterPages): void => {
      if (btn === RouterPages.not_found) return;
      const button: HeaderButton = new HeaderButton({
        buttonType: btn,
        callback: this.handlerClickButton.bind(this),
      });
      this.buttons.push(button);
    });

    this.buttons.forEach((button: HeaderButton): void => {
      blockButton.append(button.getElement());
    });

    container.append(image.getElement(), blockButton);
    currentElement.append(container);
  }

  private handlerClickButton(route: RouterPages): void {
    this.router.navigate(route);
  }
}
