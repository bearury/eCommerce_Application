import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './categories-select.module.scss';
import { ModifyCategory } from '@utils/categories-creator.ts';
import { categoryState } from '@state/state.ts';

export default class CategoriesSelect extends View {
  countApply: number;

  uls: HTMLElement[];

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.categories],
    };
    super(params);
    this.uls = [];
    this.countApply = 0;
  }

  public renderFree(categories: ModifyCategory[]) {
    categories.forEach((category: ModifyCategory) => this.getElement().append(this.buildElement(category)));
    categoryState.getState().setCategories(categories);
    categoryState.getState().setCategory(categories[0].key);
  }

  private buildElement(category: ModifyCategory) {
    const list: HTMLElement = new ElementCreator({
      tag: 'ul',
      classNames: [styles.list, this.countApply !== 0 ? styles.hide : styles.list],
      attribute: [{ type: 'data-id', value: `${this.countApply}` }],
    }).getElement();

    this.uls.push(list);

    const title: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.title],
      textContent: category.name,
      callback: [{ event: 'click', callback: () => this.handleClickItem.call(this, category.key) }],
    }).getElement();

    const item: HTMLElement = new ElementCreator({
      tag: 'li',
      classNames: [styles.item],
    }).getElement();

    const icon: HTMLElement = new ElementCreator({
      tag: 'div',
      classNames: [styles.icon],
      callback: [{ event: 'click', callback: (e: MouseEvent) => this.handleClickList.apply(this, [item, e]) }],
    }).getElement();

    this.uls.push(icon);

    icon.innerHTML = '&#9658;';

    const wrapperContent = new ElementCreator({
      tag: 'div',
      classNames: [styles.wrapperContent],
      children: [title],
    }).getElement();

    item.append(wrapperContent);

    list.append(item);

    this.countApply += 1;

    if (category.children?.length) {
      wrapperContent.append(icon);
      category.children.forEach((el) => item.append(this.buildElement(el)));
    }

    return list;
  }

  private handleClickList(item: HTMLElement, e: MouseEvent): void {
    e.stopPropagation();
    const icon = e.currentTarget as HTMLElement;
    icon.classList.toggle(styles.rotate);

    item.childNodes.forEach((el) => {
      if (el instanceof HTMLUListElement) {
        el.classList.toggle(styles.hide);
      }
    });
  }

  private handleClickItem(key: string): void {
    this.uls.map((el) => {
      if (Number(el.dataset.id) === 0) {
        return;
      } else if (el instanceof HTMLUListElement) {
        el.classList.add(styles.hide);
      } else {
        el.classList.remove(styles.rotate);
      }
    });

    categoryState.getState().setCategory(key);
  }
}
