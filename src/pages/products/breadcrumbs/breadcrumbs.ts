import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './breadcrumbs.module.scss';
import { categoryState } from '@state/state.ts';
import { getAncestorKeys } from '@utils/categories-formatter.ts';

export type ButtonsGroupType = 'Apply' | 'Cancel';

export class Breadcrumbs extends View {
  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.breadcrumbs],
    };
    super(params);
    categoryState.subscribe(() => this.handleRender.call(this));
  }

  private handleRender(): void {
    const categories = categoryState.getState().categories;
    const category = categoryState.getState().category;

    if (category) {
      const arrPaths = getAncestorKeys(categories, category);

      this.getElement().replaceChildren();

      arrPaths.forEach((el, i) => {
        const elCrumb = new ElementCreator({ tag: 'span', textContent: el, classNames: [styles.crumb] }).getElement();
        if (i > 0) {
          const separator = new ElementCreator({
            tag: 'span',
            textContent: '>',
            classNames: [styles.separator],
          }).getElement();
          this.getElement().append(separator);
        }

        this.getElement().append(elCrumb);
      });
    }
  }
}
