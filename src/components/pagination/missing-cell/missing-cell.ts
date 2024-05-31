import View from '@utils/view';
import { ParamsElementCreator } from '@utils/element-creator';
import styles from './missing-cell.module.scss';

export default class MissingCell extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'span',
      classNames: [styles.cell],
      textContent: '...',
    };
    super(params);

    this.hide();
  }

  public hide(): void {
    this.getElement().classList.add(styles.hide);
  }

  public show(): void {
    this.getElement().classList.remove(styles.hide);
  }
}
