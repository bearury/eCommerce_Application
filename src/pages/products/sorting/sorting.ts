import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './sorting.module.scss';
import Search from '@api/search';
import { apiInstance } from '@api/api';
import { productsDataState } from '@state/state';

export default class SortingBlock extends View {
  buttons: HTMLElement;

  priceAscBtn: HTMLElement;

  priceDescBtn: HTMLElement;

  nameAtoZBtn: HTMLElement;

  nameZtoABtn: HTMLElement;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.sortBlock],
      textContent: 'Sort by:',
    };
    super(params);

    this.priceAscBtn = new ElementCreator({
      tag: 'button',
      attribute: [{ type: 'data-type', value: 'priceAscBtn' }],
      textContent: 'Price ASC ⬆ ',
    }).getElement();

    this.priceDescBtn = new ElementCreator({
      tag: 'button',
      attribute: [{ type: 'data-type', value: 'priceDescBtn' }],
      textContent: 'Price DESC ⬇ ',
    }).getElement();

    this.nameAtoZBtn = new ElementCreator({
      tag: 'button',
      attribute: [{ type: 'data-type', value: 'nameAtoZBtn' }],
      textContent: 'A ➡ Z',
    }).getElement();

    this.nameZtoABtn = new ElementCreator({
      tag: 'button',
      attribute: [{ type: 'data-type', value: 'nameZtoABtn' }],
      textContent: 'Z ➡ A',
    }).getElement();

    this.buttons = new ElementCreator({
      tag: 'div',
      classNames: [styles.buttons],
      children: [this.priceAscBtn, this.priceDescBtn, this.nameAtoZBtn, this.nameZtoABtn],
    }).getElement();

    this.configureView();
  }

  private configureView(): void {
    const sortBlock: HTMLElement = this.getElement();

    this.buttons.addEventListener('click', (e: Event) => {
      const btn = e.target as HTMLElement;
      const sort = new Search(apiInstance);

      if (btn.dataset.type === 'priceAscBtn') {
        sort.search({ sort: 'price asc' }).then((data) => {
          productsDataState.getState().setData(data);
        });
      } else if (btn.dataset.type === 'priceDescBtn') {
        sort.search({ sort: 'price desc' }).then((data) => {
          productsDataState.getState().setData(data);
        });
      } else if (btn.dataset.type === 'nameAtoZBtn') {
        sort.search({ sort: 'name.en-US asc' }).then((data) => {
          productsDataState.getState().setData(data);
        });
      } else if (btn.dataset.type === 'nameZtoABtn') {
        sort.search({ sort: 'name.en-US desc' }).then((data) => {
          productsDataState.getState().setData(data);
        });
      }
    });

    sortBlock.append(this.buttons);
  }
}
