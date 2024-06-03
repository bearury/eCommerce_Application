import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './accordion.module.scss';
import AccordionButton from '@components/buttons/accordion-button/accordion-button';
import { ButtonsGroup, ButtonsGroupType } from '@pages/products/accordion/buttons-group/buttons-group';
import { RangeComponent, RangeId } from '@components/range/range';
import { DropdownGroup } from '@pages/products/accordion/dropdown-group/dropdown-group';
import { RangeValue } from '@components/range/range-element/range-element';
import ProductsApi from '@api/productsApi.ts';
import { apiInstance } from '@api/api.ts';
import { loaderState, productsDataState, toastState } from '@state/state.ts';

export default class Accordion extends View {
  content: HTMLElement | null;

  dropdowns: DropdownGroup;

  buttons: ButtonsGroup;

  rangeWattage: RangeComponent;

  rangePrice: RangeComponent;

  api: ProductsApi;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.accordion],
    };
    super(params);

    this.api = new ProductsApi(apiInstance);

    this.buttons = new ButtonsGroup(this.handleClickButton.bind(this));
    this.dropdowns = new DropdownGroup();

    this.rangeWattage = new RangeComponent({
      id: RangeId.wattage,
      label: '⚡ Select a Wattage',
      callback: (value) => this.handleChangeRange.apply(this, [RangeId.wattage, value]),
      props: { minValue: 0, maxValue: 100 },
    });
    this.rangePrice = new RangeComponent({
      id: RangeId.price,
      label: '💰 Select a price',
      callback: (value) => this.handleChangeRange.apply(this, [RangeId.price, value]),
      props: { minValue: 0, maxValue: 500 },
    });

    this.content = null;
    this.configureView();
  }

  private configureView(): void {
    const accordion = this.getElement();

    const item = new ElementCreator({ tag: 'div', classNames: [styles.item] }).getElement();
    const toggleButton = new AccordionButton({
      content: '⚙ filters',
      callback: this.handleClickOpenAccordion.bind(this),
    }).getElement();
    this.content = new ElementCreator({
      tag: 'div',
      classNames: [styles.content],
    }).getElement();

    const rangeWrapper = new ElementCreator({
      tag: 'div',
      classNames: [styles.rangeWrapper],
      children: [this.rangePrice.getElement(), this.rangeWattage.getElement()],
    }).getElement();

    this.content.append(this.dropdowns.getElement(), rangeWrapper, this.buttons.getElement());

    item.append(toggleButton, this.content);

    accordion.append(item);
  }

  private handleClickOpenAccordion(): void {
    this.content?.classList.toggle(styles.active);
  }

  private handleChangeRange(id: RangeId, value: RangeValue): void {
    console.log(id, value);
  }

  private async handleClickButton(type: ButtonsGroupType): Promise<void> {
    if (type === 'Apply') {
      const brand = this.dropdowns.getValue().brand;
      const color = this.dropdowns.getValue().color;
      const price = this.rangePrice.getValue();
      const wattage = this.rangeWattage.getValue();

      if (!brand && !color && !price.statusCheckbox && !wattage.statusCheckbox) {
        toastState.getState().toast.showError('Select at least one condition');
        return;
      }
      loaderState.getState().loader.show();
      this.api
        .getFilter({
          brand,
          color,
          price,
          wattage,
        })
        .then((data) => {
          productsDataState.getState().setData(data);
        })
        .catch((error) => toastState.getState().toast.showError(error.message))
        .finally(() => {
          loaderState.getState().loader.close();
          this.handleClickOpenAccordion();
        });
    } else if (type === 'Cancel') {
      const currentPage: number = productsDataState.getState().currentPage;
      this.dropdowns.clearValue();
      await this.api
        .get(currentPage)
        .then((data) => {
          productsDataState.getState().setData(data);
        })
        .catch((error) => {
          if (error instanceof Error) {
            toastState.getState().toast.showError(error.message);
          }
        })
        .finally(() => {
          loaderState.getState().loader.close();
          this.handleClickOpenAccordion();
        });
    }
  }
}
