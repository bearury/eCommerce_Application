import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './header-pages.module.scss';
import HeaderButton from '@components/buttons/header-button/header-button';
import { RouterPages } from '@app/app.ts';
import Router from '@router/router.ts';

export default class HeaderPages extends View {
  router: Router;

  buttons: HeaderButton[];

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.header],
    };
    super(params);
    this.router = router;

    this.buttons = [];
    this.configureView();
  }

  private configureView(): void {
    const currentElement = this.getElement();

    const buttons = [
      {
        type: RouterPages.signup,
      },
      {
        type: RouterPages.signin,
      },
      {
        type: RouterPages.main,
      },
    ];

    buttons.forEach((btn: { type: RouterPages }) => {
      const button: HeaderButton = new HeaderButton({
        buttonType: btn.type,
        callback: this.handlerClickButton.bind(this),
      });
      this.buttons.push(button);
    });

    this.buttons.forEach((button: HeaderButton) => {
      currentElement.append(button.getElement());
    });
  }

  private handlerClickButton(route: RouterPages) {
    this.router.navigate(route);
  }
}
