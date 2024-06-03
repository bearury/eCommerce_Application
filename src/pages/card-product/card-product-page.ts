import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './card-product-page.module.scss';
import ProductCard from '@api/product';
import { apiInstance } from '@api/api';
import { loaderState, toastState } from '@state/state';
import Router from '@router/router';
import { RouterPages } from '@app/app';
import { Slider } from '@components/slider/slider';
import { Price } from '@commercetools/platform-sdk';
import converterPrice from '@utils/converter-price';

const locale: string = 'en-US';
export default class CardProductPage extends View {
  name: HTMLElement;

  description: HTMLElement;

  discountBlock: HTMLElement;

  priceBlock: HTMLElement;

  infoBlock: HTMLElement;

  imgBlock: HTMLElement;

  router: Router;

  constructor(resource: string, router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.cardProduct],
    };
    super(params);
    this.router = router;

    this.name = new ElementCreator({
      tag: 'h3',
      classNames: [styles.name],
    }).getElement();

    this.discountBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.priceBlock, styles.discountBlock],
    }).getElement();

    this.priceBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.priceBlock],
    }).getElement();

    this.description = new ElementCreator({
      tag: 'div',
      classNames: [styles.description],
    }).getElement();

    this.infoBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.infoBlock],
      children: [this.name, this.discountBlock, this.priceBlock, this.description],
    }).getElement();

    this.imgBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.imgBlock],
    }).getElement();

    this.configureView(resource);
  }

  private configureView(resource: string): void {
    const cardProduct: HTMLElement = this.getElement();
    const product = new ProductCard(apiInstance);
    try {
      loaderState.getState().loader.show();

      product
        .getProductByID(resource)
        .then((data) => {
          this.name.textContent = data.body.masterData.current.name[locale];

          const desc = data.body.masterData.current.description;
          this.description.textContent = desc ? desc[locale] : '0';

          const prices: Price[] | undefined = data.body.masterData.staged.masterVariant.prices?.filter(
            (price: Price) => price.value.currencyCode === 'EUR' || price.value.currencyCode === 'USD'
          );

          prices?.forEach((price) => {
            const priceElement = new ElementCreator({
              tag: 'span',
              classNames: [styles.price],
              textContent: `${converterPrice(price.value)} ${price.value.currencyCode}`,
            }).getElement();

            if (price.discounted) {
              priceElement.classList.add(styles.priceDiscount);
              const priseDiscountElement: ElementCreator = new ElementCreator({
                tag: 'span',
                classNames: [styles.discountPrice],
                textContent: `${converterPrice(price.discounted.value)} ${price.value.currencyCode}`,
              });

              if (price.country === 'US') {
                this.discountBlock.append(priseDiscountElement.getElement());
              } else if (price.country === 'DE') {
                this.discountBlock.append(priseDiscountElement.getElement());
              }
            }

            this.priceBlock.append(priceElement);
          });

          const imgArray = data.body.masterData.staged.masterVariant.images;
          const imgUrlArray: string[] = [];
          if (imgArray) {
            imgArray.forEach((elem) => {
              imgUrlArray.push(elem.url);
            });
          }
          const slider = new Slider(imgUrlArray);
          slider.updateSlider();

          this.imgBlock.append(slider.getElement());
        })
        .catch(() => {
          toastState.getState().toast.showError('This product was not found');
          this.router.navigate(RouterPages.not_found);
        });
    } catch (error) {
      console.log('err here');
    } finally {
      loaderState.getState().loader.close();
    }

    cardProduct.append(this.imgBlock, this.infoBlock);
  }
}
