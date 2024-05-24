import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './header-button.module.scss';
import { RouterPages } from '@app/app.ts';
import { authState, routerState } from '@state/state.ts';

interface HeaderButtonProps {
  buttonType: RouterPages;
  callback: (param: RouterPages) => void;
}

export default class HeaderButton extends View {
  type: RouterPages;

  constructor({ buttonType, callback }: HeaderButtonProps) {
    const textContent: string =
      buttonType === RouterPages.signin
        ? `🗝 SignIn`
        : buttonType === RouterPages.signup
          ? `🔐 SignUp`
          : buttonType === RouterPages.main
            ? `🛒 Main`
            : buttonType === RouterPages.products
              ? `🧰 Products`
              : buttonType;

    const params: ParamsElementCreator = {
      tag: 'button',
      classNames: [styles.button],
      textContent,
      callback: [{ event: 'click', callback: () => callback(buttonType) }],
    };

    super(params);
    this.type = buttonType;

    routerState.subscribe(this.handlerChangePage.bind(this));
  }

  private handlerChangePage(): void {
    const currentPage: RouterPages | null = routerState.getState().page;
    if (currentPage && currentPage === this.type) {
      this.getElement().classList.add(styles.active);
    } else {
      this.getElement().classList.remove(styles.active);
    }

    if (authState.getState().isAuthorized && (this.type === RouterPages.signup || this.type === RouterPages.signin)) {
      this.getElement().classList.add(styles.hid);
    } else {
      this.getElement().classList.remove(styles.hid);
    }
  }
}
