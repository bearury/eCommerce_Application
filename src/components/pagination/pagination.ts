import View from '@utils/view';
import { ParamsElementCreator } from '@utils/element-creator';
import styles from './pagination.module.scss';
import Cell from '@components/pagination/cell/cell';
import { ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import MissingCell from '@components/pagination/missing-cell/missing-cell';
import { countProductsOnOnePage } from '@utils/variables.ts';

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

  public setParams(body: ProductProjectionPagedSearchResponse): void {
    this.getElement().replaceChildren();
    this.configureView(body);
  }

  private configureView(body: ProductProjectionPagedSearchResponse): void {
    const { offset, total, limit } = body;

    if (!total || total < countProductsOnOnePage) return;

    const countPages: number = Math.ceil(total / limit);
    // const activePage: number = offset === 0 ? 1 : offset / limit;
    const activePage: number = offset / limit + 1;

    const arrPage: number[] = Array.from({ length: countPages }, (_, i) => i + 1);
    const step = 2;

    console.warn(body);

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

    arrPage.forEach((numberPage) => {
      const cell: Cell = new Cell({ numberPage: numberPage.toString(), callback: this.handleClickCell.bind(this) });
      if (numberPage === activePage) {
        console.log('[71] 🚧: ', activePage);
        cell.setActive();
      } else {
        cell.removeActive();
      }

      if (
        (numberPage < activePage - step && numberPage !== 1) ||
        (numberPage > activePage + step && numberPage !== arrPage.length)
      ) {
        cell.hide();
      } else {
        cell.show();
      }

      this.cells.push(cell);

      paginationElement.append(cell.getElement());

      if (arrPage.length > step && numberPage === 1) paginationElement.append(leftMissingCell.getElement());
      if (arrPage.length > step && numberPage === arrPage.length - 1)
        paginationElement.append(rightMissingCell.getElement());
    });

    if (activePage - step > step) {
      leftMissingCell.show();
    } else {
      leftMissingCell.hide();
    }

    if (activePage + 1 < arrPage.length - step) {
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
    console.log('⚡: CLICK CELL', page);

    this.callback(page);

    // this.cells.forEach((cell: Cell): void => {
    //   if (cell.getValue() === page) {
    //     console.log('[127] 🌻: ', page, cell.getValue() === page);
    //     cell.setActive();
    //   } else {
    //     cell.removeActive();
    //   }
    // });
  }
}
