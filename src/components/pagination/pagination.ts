import View from '@utils/view';
import { ParamsElementCreator } from '@utils/element-creator';
import styles from './pagination.module.scss';
import Cell from '@components/pagination/cell/cell';
import { ProductPagedQueryResponse } from '@commercetools/platform-sdk';
import MissingCell from '@components/pagination/missing-cell/missing-cell.ts';

export default class Pagination extends View {
  cells: Cell[];

  callback: (page: string) => void;

  constructor(callback: (page: string) => void) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.pagination],
    };
    super(params);

    this.callback = callback;
    this.cells = [] as Cell[];
  }

  public setParams(body: ProductPagedQueryResponse): void {
    this.getElement().replaceChildren();
    this.configureView(body);
  }

  private configureView(body: ProductPagedQueryResponse): void {
    const { offset, total, limit } = body;

    if (!total || total < 10) return;

    const countPages: number = Math.floor(total / limit);
    const activePage: number = offset / limit;
    const arrPage: number[] = Array.from({ length: countPages }, (_, i) => i + 1);
    const step = 3;

    const paginationElement: HTMLElement = this.getElement();

    const leftMissingCell = new MissingCell().getElement();

    const cellLeft: Cell = new Cell({
      numberPage: '\u25C0',
      callback: this.handleClickCell.bind(this),
    });

    if (activePage === 1) {
      cellLeft.setActive();
    } else {
      cellLeft.removeActive();
    }

    paginationElement.append(cellLeft.getElement());

    arrPage.forEach((numberPage, index) => {
      const cell: Cell = new Cell({ numberPage: numberPage.toString(), callback: this.handleClickCell.bind(this) });
      if (index + 1 === activePage) {
        cell.setActive();
      } else {
        cell.removeActive();
      }

      if (index < activePage - step && index !== 0) {
        cell.hide();
      } else {
        cell.show();
      }

      this.cells.push(cell);

      paginationElement.append(cell.getElement());
    });

    if (activePage > step) {
      this.cells[1].getElement().after(leftMissingCell);

      console.log('🆘: ', this.cells[0]);
    }

    const cellRight: Cell = new Cell({
      numberPage: '\u25BA',
      callback: this.handleClickCell.bind(this),
    });

    if (activePage === countPages) {
      cellRight.setActive();
    } else {
      cellRight.removeActive();
    }

    paginationElement.append(cellRight.getElement());
  }

  private handleClickCell(page: string): void {
    this.callback(page);

    this.cells.forEach((cell: Cell): void => {
      if (cell.getValue() === page) {
        cell.setActive();
      } else {
        cell.removeActive();
      }
    });
  }
}
