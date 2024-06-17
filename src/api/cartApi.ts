import Api, { projectKey } from '@api/api';
import {
  ByProjectKeyRequestBuilder,
  Cart,
  CartAddLineItemAction,
  CartRemoveLineItemAction,
  CartChangeLineItemQuantityAction,
  ClientResponse,
  MyCartUpdate,
} from '@commercetools/platform-sdk';
import { cartState, loaderState, toastState } from '@state/state';

export class CartApi {
  private apiInstance: Api;

  private customerBuilder: ByProjectKeyRequestBuilder;

  constructor(apiInstance: Api) {
    this.apiInstance = apiInstance;
    const client = this.apiInstance.getClient();
    if (!client) {
      throw new Error('API client not initialized');
    }
    this.customerBuilder = client.withProjectKey({ projectKey });
  }

  async createAnonymousCart(): Promise<string | undefined> {
    try {
      const response = await this.customerBuilder
        .me()
        .carts()
        .post({
          body: {
            currency: 'EUR',
            country: 'DE',
          },
        })
        .execute();
      localStorage.setItem('cartId', response.body.id);
      localStorage.setItem('cartVersion', `${response.body.version}`);
      return response.body.id;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  async addToCart(cartId: string, productId: string): Promise<ClientResponse<Cart> | undefined> {
    try {
      const currentVersion = localStorage.getItem('cartVersion');
      if (!currentVersion) {
        throw new Error('No cart version');
      }
      const requestBody: MyCartUpdate = {
        version: +currentVersion,
        actions: [
          {
            action: 'addLineItem',
            productId: productId,
          } as CartAddLineItemAction,
        ],
      };

      const response = await this.customerBuilder
        .me()
        .carts()
        .withId({ ID: cartId })
        .post({ body: requestBody })
        .execute();
      if (response.statusCode === 200) {
        toastState.getState().toast.showSuccess('Added to cart');
        localStorage.setItem('cartVersion', `${response.body.version}`);
        cartState.getState().setCart(response);
        return response;
      }
    } catch (error) {
      if (error instanceof Error) {
        const message = 'Something went wrong during add to cart process, please try again.';
        toastState.getState().toast.showError(message);
      }
      throw error;
    } finally {
      loaderState.getState().loader.close();
    }
  }

  async addDiscount(cartId: string, promoCode: string) {
    try {
      const currentVersion = localStorage.getItem('cartVersion');
      if (!currentVersion) {
        throw new Error('No cart version');
      }
      const requestBody: MyCartUpdate = {
        version: +currentVersion,
        actions: [
          {
            action: 'addDiscountCode',
            code: promoCode,
          },
        ],
      };

      const response = await this.customerBuilder
        .me()
        .carts()
        .withId({ ID: cartId })
        .post({ body: requestBody })
        .execute();
      if (response.statusCode === 200) {
        toastState.getState().toast.showSuccess('Applied!');
        localStorage.setItem('cartVersion', `${response.body.version}`);
        return response;
      }
    } catch (error) {
      if (error instanceof Error) {
        const message = 'Check the entered promocode';
        toastState.getState().toast.showError(message);
      }
      throw error;
    } finally {
      loaderState.getState().loader.close();
    }
  }

  async deleteFromCart(cartId: string, productId: string): Promise<ClientResponse<Cart> | undefined> {
    try {
      const currentVersion = localStorage.getItem('cartVersion');
      if (!currentVersion) {
        throw new Error('No cart version');
      }
      const requestBody: MyCartUpdate = {
        version: +currentVersion,
        actions: [
          {
            action: 'removeLineItem',
            lineItemId: productId,
          } as CartRemoveLineItemAction,
        ],
      };

      const response = await this.customerBuilder
        .me()
        .carts()
        .withId({ ID: cartId })
        .post({ body: requestBody })
        .execute();
      if (response.statusCode === 200) {
        toastState.getState().toast.showSuccess('Product deleted');
        localStorage.setItem('cartVersion', `${response.body.version}`);
        cartState.getState().setCart(response);
        return response;
      }
    } catch (error) {
      if (error instanceof Error) {
        const message = 'Something went wrong during delete from cart process, please try again.';
        toastState.getState().toast.showError(message);
      }
      throw error;
    } finally {
      loaderState.getState().loader.close();
    }
  }

  public async getCart(): Promise<ClientResponse<Cart>> {
    return this.customerBuilder.me().activeCart().get().execute();
  }

  public async changeLineItemQuantity(
    cartId: string,
    lineItemId: string,
    quantity: number
  ): Promise<ClientResponse<Cart>> {
    const currentVersion = localStorage.getItem('cartVersion');
    if (!currentVersion) {
      throw new Error('No cart version');
    }

    const requestBody: MyCartUpdate = {
      version: +currentVersion,
      actions: [
        {
          action: 'changeLineItemQuantity',
          lineItemId,
          quantity,
        } as CartChangeLineItemQuantityAction,
      ],
    };

    return this.customerBuilder
      .me()
      .carts()
      .withId({ ID: cartId })
      .post({ body: requestBody })
      .execute()
      .then((response) => {
        localStorage.setItem('cartVersion', `${response.body.version}`);
        cartState.getState().setCart(response);
        return response;
      });
  }
}

export default CartApi;
