import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './count-indicator.module.scss';

export default class CountIndicator extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'span',
      classNames: [styles.countIndicator],
    };

    super(params);
  }

  public setValue(count: number) {
    this.getElement().textContent = String(count);
  }

  public visible(): void {
    this.getElement().classList.add(styles.visible);
  }

  public hide(): void {
    this.getElement().classList.remove(styles.visible);
  }
}
