import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './categories-select.module.scss';
import { ModifyCategory } from '@utils/categories-creator.ts';

export default class CategoriesSelect extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.aside],
    };

    super(params);
  }

  public renderFree(categories: ModifyCategory[]) {
    console.log('[18] 🐬: ', categories);
    categories.forEach((category: ModifyCategory) => this.getElement().append(this.buildElement(category)));
  }

  private buildElement(category: ModifyCategory) {
    const title = new ElementCreator({
      tag: 'div',
      classNames: [styles.title],
      textContent: category.key,
    });
    if (category.children?.length) {
      category.children.forEach((el) => title.getElement().append(this.buildElement(el)));
    }

    return title.getElement();
  }
}
