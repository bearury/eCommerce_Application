import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './container.module.scss';

export default class Container extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.container],
    };
    super(params);
  }

  static get(): HTMLElement {
    return new Container().getElement();
  }
}
