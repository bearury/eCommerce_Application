import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './about-page.module.scss';
import Router from '@router/router.ts';

export default class AboutPage extends View {
  router: Router;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
    };
    super(params);
    this.router = router;

    this.configureView();
  }

  private configureView(): void {
    const about = this.getElement();

    about.textContent = 'This is about page';
  }
}
