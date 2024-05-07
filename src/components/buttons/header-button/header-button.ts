import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './header-button.module.scss';
import { RouterPages } from '@app/app.ts';

interface HeaderButtonProps {
  buttonType: ButtonType;
  callback: (param: RouterPages) => void;
}

type ButtonType = RouterPages;

export default class HeaderButton extends View {
  constructor({ buttonType, callback }: HeaderButtonProps) {
    const params: ParamsElementCreator = {
      tag: 'button',
      classNames: [styles.button],
      textContent: buttonType,
      callback: [{ event: 'click', callback: () => callback(buttonType) }],
    };

    super(params);
  }
}
