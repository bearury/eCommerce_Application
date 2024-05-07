import View from '@utils/view.ts';
import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './sign-up-page.module.scss';

export default class SignUpPage extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
      textContent: 'SignUpPage',
    };
    super(params);
  }
}
