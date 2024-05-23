import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './header-pages.module.scss';
import buttonStyles from '@components/buttons/header-button/header-button.module.scss';
import HeaderButton from '@components/buttons/header-button/header-button';
import { RouterPages } from '@app/app.ts';
import Router from '@router/router.ts';
import Image from '@components/image/image';
import img from '/shopping-cart.png';
import { authState } from '@state/state';
import { apiInstance, isAuthorized } from '@api/api';
import BurgerButton from '@components/buttons/burger-button/burger-button';
import burgerStyles from '@components/buttons/burger-button/burger-button.module.scss';

export default class HeaderPages extends View {
  router: Router;

  buttons: HeaderButton[];

  logOutButton: HTMLElement;

  blockButton: HTMLElement;

  burgerMenuButton: BurgerButton;

  burgerMenuPopup: HTMLElement;

  container: HTMLElement;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'header',
      classNames: [styles.header],
    };
    super(params);

    this.router = router;
    this.buttons = [];

    this.logOutButton = new ElementCreator({
      tag: 'button',
      classNames: [buttonStyles.button],
      callback: [{ event: 'click', callback: this.logOut.bind(this) }],
      textContent: '🔒 Logout',
    }).getElement();

    this.blockButton = new ElementCreator({
      tag: 'div',
      classNames: [styles.blockButton, burgerStyles.blockButton],
    }).getElement();

    this.burgerMenuButton = new BurgerButton({ callbackBtn: this.togglePopup.bind(this) });

    this.burgerMenuPopup = new ElementCreator({
      tag: 'div',
      classNames: [burgerStyles.burgerMenuPopup],
      attribute: [{ type: 'data-state', value: 'closed' }],
    }).getElement();

    this.container = new ElementCreator({ tag: 'div', classNames: [styles.container] }).getElement();

    this.configureView();
    this.updateLogOutButton(!!isAuthorized);
    authState.subscribe((state) => {
      this.updateLogOutButton(state.isAuthorized);
    });
  }

  private configureView(): void {
    const currentElement: HTMLElement = this.getElement();

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 624 && this.blockButton.parentNode !== this.container) {
        this.container.append(this.blockButton);
        this.burgerMenuButton.rotateLine();
        this.closePopup();
      }
    });

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
      this.blockButton.append(button.getElement());
    });

    this.container.append(
      image.getElement(),
      this.blockButton,
      this.burgerMenuButton.getElement(),
      this.burgerMenuPopup
    );
    currentElement.append(this.container);
  }

  private updateLogOutButton(isAuthorized: boolean): void {
    if (isAuthorized) {
      if (!this.blockButton.contains(this.logOutButton)) {
        this.blockButton.append(this.logOutButton);
      }
    } else {
      if (this.blockButton.contains(this.logOutButton)) {
        this.blockButton.removeChild(this.logOutButton);
      }
    }
  }

  private handlerClickButton(route: RouterPages): void {
    this.router.navigate(route);
    this.burgerMenuButton.rotateLine();
    this.closePopup();
  }

  private logOut() {
    localStorage.clear();
    authState.getState().setIsAuthorized(false);
    apiInstance.createAnonymousSession();
    this.handlerClickButton(RouterPages.main);
  }

  private openPopup() {
    this.burgerMenuPopup.removeAttribute('data-state');
    this.container.removeChild(this.blockButton);
    this.burgerMenuPopup.classList.add(`${burgerStyles.open}`);
    this.burgerMenuPopup.append(this.blockButton);
    document.body.classList.add(`${burgerStyles.noscroll}`);
  }

  private closePopup() {
    this.burgerMenuPopup.setAttribute('data-state', 'closed');
    this.container.append(this.blockButton);
    this.burgerMenuPopup.classList.remove(`${burgerStyles.open}`);
    document.body.classList.remove(`${burgerStyles.noscroll}`);
  }

  private togglePopup() {
    this.burgerMenuButton.rotateLine();

    if (this.burgerMenuPopup.hasAttribute('data-state')) {
      this.openPopup();
    } else {
      this.closePopup();
    }
  }
}
