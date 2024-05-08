import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './header-button.module.scss';
import { RouterPages } from '@app/app.ts';
import { routerState } from '@state/state.ts';

interface HeaderButtonProps {
  buttonType: ButtonType;
  callback: (param: RouterPages) => void;
}

type ButtonType = RouterPages;

export default class HeaderButton extends View {
  type: RouterPages;

  constructor({ buttonType, callback }: HeaderButtonProps) {
    const params: ParamsElementCreator = {
      tag: 'button',
      classNames: [styles.button],
      textContent: buttonType,
      callback: [{ event: 'click', callback: () => callback(buttonType) }],
    };

    super(params);
    this.type = buttonType;

    routerState.subscribe(this.handlerChangePage.bind(this));
  }

  handlerChangePage() {
    const currentPage = routerState.getState().page;
    if (currentPage && currentPage === this.type) {
      this.getElement().classList.add(styles.active);
    } else {
      this.getElement().classList.remove(styles.active);
    }
  }
}
