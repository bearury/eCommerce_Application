export const enum SelectColor {
  black = 'black',
  white = 'white',
  gray = 'gray',
}

export const selectColor: ItemDropdownProps<SelectColor>[] = [
  { id: '1', title: SelectColor.black },
  { id: '2', title: SelectColor.white },
  { id: '3', title: SelectColor.gray },
];

export interface ItemDropdownProps<T> {
  id: string;
  title: T;
}

export const enum SelectBrand {
  saffit = 'Saffit',
  feron = 'Feron',
}

export const selectBrand: ItemDropdownProps<SelectBrand>[] = [
  { id: '1', title: SelectBrand.feron },
  { id: '2', title: SelectBrand.saffit },
];
