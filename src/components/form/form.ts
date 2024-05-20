import { ParamsElementCreator } from '@utils/element-creator';
import View from '@utils/view';
import styles from '@components/form/form.module.scss';

export default class Form extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'form',
      classNames: [styles.form],
      attribute: [{ type: 'novalidate', value: '' }],
    };

    super(params);
  }
}
