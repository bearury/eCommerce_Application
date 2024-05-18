import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './main-page.module.scss';

export default class MainPage extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
      textContent: 'MainPage',
    };
    super(params);

    this.configureView();
  }

  configureView() {}
}
