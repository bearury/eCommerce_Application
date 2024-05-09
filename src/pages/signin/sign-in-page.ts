import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './sign-in-page.module.scss';
import View from '@utils/view.ts';

export default class SignInPage extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
      textContent: 'SignInPage',
    };
    super(params);
  }
}
