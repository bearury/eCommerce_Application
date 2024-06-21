import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './header-button.module.scss';
import { RouterPages } from '@app/app.ts';
import { authState, cartState, routerState } from '@state/state.ts';
import CountIndicator from '@components/buttons/header-button/count-indicator/count-indicator.ts';

interface HeaderButtonProps {
  buttonType: RouterPages;
  callback: (param: RouterPages) => void;
}

export default class HeaderButton extends View {
  type: RouterPages;

  countIndicator: CountIndicator;

  constructor({ buttonType, callback }: HeaderButtonProps) {
    const textContent: string =
      buttonType === RouterPages.signin
        ? `🗝 SignIn`
        : buttonType === RouterPages.signup
          ? `🔐 SignUp`
          : buttonType === RouterPages.profile
            ? `👤 Profile`
            : buttonType === RouterPages.main
              ? `💡 Main`
              : buttonType === RouterPages.products
                ? `🧰 Products`
                : buttonType === RouterPages.basket
                  ? `🛒 Basket`
                  : buttonType === RouterPages.about
                    ? `🥭 About Us`
                    : buttonType;

    const params: ParamsElementCreator = {
      tag: 'button',
      classNames: [
        styles.button,
        buttonType === RouterPages.about || buttonType === RouterPages.products ? styles.about : styles.button,
      ],
      textContent,
      callback: [{ event: 'click', callback: () => callback(buttonType) }],
    };

    super(params);

    this.getElement().classList.add();
    this.type = buttonType;
    this.countIndicator = new CountIndicator();

    cartState.subscribe(this.addCountItemBasket.bind(this));
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

  private addCountItemBasket(): void {
    const cartLength: number | undefined = cartState.getState().cart?.body.lineItems.length;
    if (this.type === RouterPages.basket && cartLength) {
      this.getElement().append(this.countIndicator.getElement());
      this.countIndicator.setValue(cartLength);
    } else if (this.type === RouterPages.basket) {
      this.getElement().textContent = `🛒 Basket`;
    }
  }
}
