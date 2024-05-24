import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './image.module.scss';

export interface ImageProps {
  classNames: string[];
  img: string;
}

export default class Image extends View {
  image: ElementCreator;

  constructor({ classNames, img }: ImageProps) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.wrapper, ...classNames],
    };
    super(params);

    this.image = new ElementCreator({ tag: 'img', classNames: [styles.img], attribute: [{ type: 'src', value: img }] });

    this.configureView();
  }

  private configureView(): void {
    const wrapper: HTMLElement = this.getElement();
    wrapper.append(this.image.getElement());
  }
}
