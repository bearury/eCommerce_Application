import View from '@utils/view';
import { ParamsElementCreator } from '@utils/element-creator';
import styles from './pagination.module.scss';
import Cell from '@components/pagination/cell/cell';
import { ProductPagedQueryResponse } from '@commercetools/platform-sdk';
import MissingCell from '@components/pagination/missing-cell/missing-cell';

export const enum CellIconType {
  left = '\u25C0',
  right = '\u25BA',
}

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

    if (!total || total < 12) return;

    const countPages: number = Math.floor(total / limit);
    const activePage: number = offset / limit;
    const arrPage: number[] = Array.from({ length: countPages }, (_, i) => i + 1);
    const step = 3;

    const paginationElement: HTMLElement = this.getElement();

    this.cells = [];

    const leftMissingCell: MissingCell = new MissingCell();
    const rightMissingCell: MissingCell = new MissingCell();

    const cellLeft: Cell = new Cell({
      numberPage: CellIconType.left,
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

      if ((index < activePage - step && index !== 0) || (index > activePage + 1 && index !== arrPage.length - 1)) {
        cell.hide();
      } else {
        cell.show();
      }

      this.cells.push(cell);

      paginationElement.append(cell.getElement());

      if (arrPage.length > step && index === 0) paginationElement.append(leftMissingCell.getElement());
      if (arrPage.length > step && index === arrPage.length - 2)
        paginationElement.append(rightMissingCell.getElement());
    });

    if (activePage - 1 > step) {
      leftMissingCell.show();
    } else {
      leftMissingCell.hide();
    }

    if (activePage < arrPage.length - step) {
      rightMissingCell.show();
    } else {
      rightMissingCell.hide();
    }

    const cellRight: Cell = new Cell({
      numberPage: CellIconType.right,
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
