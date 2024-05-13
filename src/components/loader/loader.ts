import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './loader.module.scss';

export default class Loader extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'span',
      classNames: [styles.loaderWrapper],
    };
    super(params);
    this.configureView();
  }

  public show(): void {
    this.getElement().classList.add(styles.active);
  }

  public close(): void {
    this.getElement().classList.remove(styles.active);
  }

  private configureView(): void {
    const loader: ElementCreator = new ElementCreator({ tag: 'span', classNames: [styles.loader] });
    this.getElement().append(loader.getElement());
  }
}
