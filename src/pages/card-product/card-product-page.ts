import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './card-product-page.module.scss';
import ProductCard from '@api/product';
import { apiInstance } from '@api/api';
import { cartState, loaderState, toastState } from '@state/state';
import Router from '@router/router';
import { RouterPages } from '@app/app';
import { Slider } from '@components/slider/slider';
import { Cart, ClientResponse, Price } from '@commercetools/platform-sdk';
import converterPrice from '@utils/converter-price';
import sliderStyles from '@components/slider/slider.module.scss';
import { ModalSlider } from '@components/slider/modal-slider/modal-slider';
import Input, { InputType } from '@components/input/input';
import CartApi from '@api/cartApi.ts';
import { svgHtmlWasteBasket } from '@components/svg/waste-basket';

const locale: string = 'en-US';
export default class CardProductPage extends View {
  name: HTMLElement;

  description: HTMLElement;

  discountBlock: HTMLElement;

  priceBlock: HTMLElement;

  infoBlock: HTMLElement;

  imgBlock: HTMLElement;

  router: Router;

  addToCartButton: Input;

  productId: string;

  buttonDelete: HTMLElement;

  buttonsBlock: HTMLElement;

  productInCartId: string;

  constructor(resource: string, router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.cardProduct],
    };
    super(params);
    this.productId = resource;
    this.router = router;
    this.productInCartId = '';

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
    this.addToCartButton = new Input({
      inputType: InputType.button,
      callbacks: [{ event: 'click', callback: this.addToCart.bind(this) }],
      classNames: ['button'],
      value: 'Add to cart 🛒',
      disabled: false,
    });
    this.buttonDelete = new ElementCreator({
      tag: 'button',
      classNames: [styles.buttonDelete],
      callback: [{ event: 'click', callback: () => this.deleteProduct() }],
    }).getElement();
    this.buttonsBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.buttonsBlock],
      children: [this.addToCartButton.getElement()],
    }).getElement();
    this.buttonDelete.innerHTML = svgHtmlWasteBasket;
    this.configureView(resource);
  }

  private async configureView(resource: string): Promise<void> {
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
          slider.getElement().addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains(sliderStyles.img)) {
              this.renderModal(imgUrlArray);
            }
          });

          this.imgBlock.append(slider.getElement());
        })
        .catch(() => {
          toastState.getState().toast.showError('This product was not found');
          this.router.navigate(RouterPages.not_found);
        });
    } finally {
      loaderState.getState().loader.close();
    }
    const cart: ClientResponse<Cart> | null = cartState.getState().cart;
    if (!cart) {
      throw new Error('No cart!');
    }
    const productInCart = cart.body.lineItems;
    if (productInCart) {
      productInCart.forEach((product) => {
        if (product.productId === this.productId) {
          const button = this.addToCartButton.getElement() as HTMLButtonElement;
          button.value = 'In cart ✅';
          button.disabled = true;
          this.buttonsBlock.append(this.buttonDelete);
        }
      });
    }

    this.infoBlock.append(this.buttonsBlock);
    cardProduct.append(this.imgBlock, this.infoBlock);
  }

  private renderModal(images: string[]): void {
    const subModalSlider = new Slider(images);
    subModalSlider.getElement().classList.add(sliderStyles.subSlider);
    subModalSlider.updateSlider();
    const modal = new ModalSlider(subModalSlider).getElement();
    document.body.append(modal);
  }

  private async addToCart(): Promise<void> {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      throw new Error('No cart id!');
    }
    const response = await new CartApi(apiInstance).addToCart(cartId, this.productId);
    if (response && response.statusCode === 200) {
      const button = this.addToCartButton.getElement() as HTMLButtonElement;
      button.value = 'In cart ✅';
      button.disabled = true;
      this.buttonsBlock.append(this.buttonDelete);
    }
  }

  private async deleteProduct(): Promise<void> {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      throw new Error('No cart id!');
    }
    await this.checkProductInCart();
    const response = await new CartApi(apiInstance).deleteFromCart(cartId, this.productInCartId);
    if (response && response.statusCode === 200) {
      const button = this.addToCartButton.getElement() as HTMLButtonElement;
      button.value = 'Add to cart 🛒';
      button.disabled = false;
      this.buttonDelete.remove();
    }
  }

  private async checkProductInCart(): Promise<boolean> {
    const cart: ClientResponse<Cart> | null = cartState.getState().cart;
    if (!cart) {
      throw new Error('No cart!');
    }
    const productInCart = cart.body.lineItems;
    if (productInCart) {
      productInCart.forEach((product) => {
        if (product.productId === this.productId) {
          this.productInCartId = product.id;
          return true;
        }
      });
    }
    return false;
  }
}
