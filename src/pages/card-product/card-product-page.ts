import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './card-product-page.module.scss';
import ProductCard from '@api/product';
import { apiInstance } from '@api/api';
import Image from '@components/image/image';
import { loaderState, toastState } from '@state/state';
import Router from '@router/router';
import { RouterPages } from '@app/app';
import noImage from '/noImage.png';

const locale: string = 'en-US';
export default class CardProductPage extends View {
  name: HTMLElement;

  description: HTMLElement;

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

    this.description = new ElementCreator({
      tag: 'div',
      classNames: [styles.description],
    }).getElement();

    this.infoBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.infoBlock],
      children: [this.name, this.description],
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
          const imgArray = data.body.masterData.staged.masterVariant.images;
          const img = imgArray ? imgArray[0].url : noImage;
          const image: Image = new Image({ classNames: [styles.img], img });
          this.imgBlock.append(image.getElement());
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
