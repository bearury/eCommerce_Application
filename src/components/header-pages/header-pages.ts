import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './header-pages.module.scss';
import buttonStyles from '@components/buttons/header-button/header-button.module.scss';
import HeaderButton from '@components/buttons/header-button/header-button';
import { RouterPages } from '@app/app.ts';
import Router from '@router/router.ts';
import Image from '@components/image/image';
import img from '/shopping-cart.png';
// import img from '/logo.png';
import { authState } from '@state/state';
import { apiInstance, isAuthorized } from '@api/api';

export default class HeaderPages extends View {
  router: Router;

  buttons: HeaderButton[];

  logOutButton: HTMLElement;

  blockButton: HTMLElement;

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

    this.blockButton = new ElementCreator({ tag: 'div', classNames: [styles.blockButton] }).getElement();

    this.configureView();
    this.updateLogOutButton(!!isAuthorized);
    authState.subscribe((state) => {
      this.updateLogOutButton(state.isAuthorized);
    });
  }

  private configureView(): void {
    const currentElement: HTMLElement = this.getElement();
    const container: HTMLElement = new ElementCreator({ tag: 'div', classNames: [styles.container] }).getElement();

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

    const burgerMenuBtn: HTMLElement = new ElementCreator({
      tag: 'button',
      classNames: [styles.burgerMenuBtn],
      callback: [{ event: 'click', callback: this.openPopup.bind(this) }],
    }).getElement();

    const burgerLine1: ElementCreator = new ElementCreator({
      tag: 'div',
      classNames: [styles.burgerLine, styles.burgerLine1],
    });
    const burgerLine2: ElementCreator = new ElementCreator({
      tag: 'div',
      classNames: [styles.burgerLine, styles.burgerLine2],
    });

    burgerMenuBtn.append(burgerLine1.getElement(), burgerLine2.getElement());

    const burgerMenuPopup: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.burgerMenuPopup],
    }).getElement();
    burgerMenuPopup.append(this.blockButton.cloneNode(true));

    container.append(image.getElement(), this.blockButton, burgerMenuBtn, burgerMenuPopup);
    currentElement.append(container);
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
  }

  private logOut() {
    localStorage.clear();
    authState.getState().setIsAuthorized(false);
    apiInstance.createAnonymousSession();
    this.handlerClickButton(RouterPages.main);
  }

  private openPopup(e: Event) {
    e.preventDefault();
    const popup = Array.from(document.body.getElementsByClassName(`${styles.burgerMenuPopup}`));
    const lines = Array.from(document.body.getElementsByClassName(`${styles.burgerLine}`));
    popup?.map((el) => el.classList.toggle(`${styles.open}`));
    lines.map((el) => el.classList.toggle(`${styles.active}`));
    document.body.classList.toggle(`${styles.noscroll}`);

    const links = Array.from(Array.from(document.body.getElementsByClassName(`${buttonStyles.button}`)));
    links.forEach((link) => {
      link.addEventListener('click', this.closeOnClick.bind(this));
    });
  }

  private closeOnClick(e: Event) {
    // change later
    const btn = e.target as HTMLElement;
    console.log(btn.textContent);
    if (btn.textContent === '🛒 Main') this.handlerClickButton(RouterPages.main);
    if (btn.textContent === '🗝 SignIn') this.handlerClickButton(RouterPages.signin);
    if (btn.textContent === '🔐 SignUp') this.handlerClickButton(RouterPages.signup);

    const popup = Array.from(document.body.getElementsByClassName(`${styles.burgerMenuPopup}`));
    const lines = Array.from(document.body.getElementsByClassName(`${styles.burgerLine}`));
    popup?.map((el) => el.classList.remove(`${styles.open}`));
    lines.map((el) => el.classList.remove(`${styles.active}`));
    document.body.classList.remove(`${styles.noscroll}`);
  }
}
