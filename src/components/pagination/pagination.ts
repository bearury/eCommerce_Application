import View from '@utils/view';
import { ParamsElementCreator } from '@utils/element-creator';
import styles from './pagination.module.scss';
import Cell from '@components/pagination/cell/cell';

export default class Pagination extends View {
  cells: Cell[];

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.pagination],
    };
    super(params);
    this.cells = [] as Cell[];
    this.configureView();
  }

  public setParams(): void {}

  private configureView(): void {
    const arrPage = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const activePage = 1;

    arrPage.forEach((numberPage, index) => {
      const cell: Cell = new Cell({ numberPage, callback: this.handleClickCell.bind(this) });
      if (index + 1 === activePage) {
        cell.setActive();
      } else {
        cell.removeActive();
      }
      this.cells.push(cell);

      this.getElement().append(cell.getElement());
    });
  }

  private handleClickCell(page: number): void {
    this.cells.forEach((cell) => {
      if (cell.getValue() === page) {
        cell.setActive();
      } else {
        cell.removeActive();
      }
    });
  }
}
