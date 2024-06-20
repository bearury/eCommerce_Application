import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './searching.module.scss';
import Search from '@api/search';
import { apiInstance } from '@api/api';
import { productsState, toastState } from '@state/state';

export default class SearchingField extends View {
  input: HTMLElement;

  searchBtn: HTMLElement;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.searchField],
      textContent: 'Search:',
    };
    super(params);

    this.input = new ElementCreator({
      tag: 'input',
      classNames: [styles.inputField],
      attribute: [{ type: 'placeholder', value: 'Please, enter your request' }],
    }).getElement();

    this.searchBtn = new ElementCreator({
      tag: 'button',
      textContent: 'search',
      classNames: [styles.searchBtn],
      callback: [{ event: 'click', callback: this.searchProduct.bind(this) }],
    }).getElement();

    this.configureView();
  }

  private searchProduct() {
    const inputValue = this.input as HTMLInputElement;
    const search = new Search(apiInstance);

    search
      .search({
        'text.en-US': inputValue.value,
        fuzzy: true,
        fuzzyLevel: 1,
      })
      .then((data) => {
        productsState.getState().setData(data);
      })
      .catch(() => {
        toastState
          .getState()
          .toast.showError('Invalid Request! Please, enter a clearer query (and more than 2 real characters).');
      });
  }

  private configureView(): void {
    const searchField: HTMLElement = this.getElement();
    // document.addEventListener('keydown', (event) => {
    //   if (event.code == 'Enter') {
    //     this.searchProduct();
    //   }
    // });
    searchField.append(this.input, this.searchBtn);
  }
}
