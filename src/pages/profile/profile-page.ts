import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './profile-page.module.scss';
import Container from '@components/container/container';

export default class ProfilePage extends View {
  container: HTMLElement;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.profile],
    };
    super(params);
    this.container = Container.get();
    this.getElement().append(this.container);

    this.configureView();
  }

  private configureView(): void {
    const title = new ElementCreator({ tag: 'span', textContent: 'This is profile page ⭐' });

    this.container.append(title.getElement());
  }
}
