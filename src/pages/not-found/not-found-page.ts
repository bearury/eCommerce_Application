import { ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './not-found-page.module.scss';
import View from '@utils/view.ts';
import ElementCreator2 from '@utils/element-creator2';

export default class NotFoundPage extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
    };
    super(params);
    this.configureView();
  }

  configureView() {
    const subtitle = ElementCreator2.create({
      tag: 'div',
      classNames: [styles.subtitle],
      textContent: 'Page no fount',
    });
    const title = ElementCreator2.create({ tag: 'div', classNames: [styles.title], textContent: '404' });
    const block = ElementCreator2.create({ tag: 'div', children: [title, subtitle] });

    this.getElement().append(block);
  }
}
