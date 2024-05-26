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
          : buttonType === RouterPages.profile
            ? `👤 Profile`
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
    const element: HTMLElement = this.getElement();
    const currentPage: RouterPages | null = routerState.getState().page;
    const isAuthorized: boolean = authState.getState().isAuthorized;

    element.classList.toggle(styles.active, currentPage === this.type);

    if (
      (isAuthorized && (this.type === RouterPages.signup || this.type === RouterPages.signin)) ||
      (!isAuthorized && this.type === RouterPages.profile)
    ) {
      element.classList.add(styles.hid);
    } else {
      element.classList.remove(styles.hid);
    }
  }
}
