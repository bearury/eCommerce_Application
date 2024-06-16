import Api, { projectKey } from '@api/api';
import {
  ByProjectKeyRequestBuilder,
  Cart,
  CartAddLineItemAction,
  ClientResponse,
  MyCartUpdate,
} from '@commercetools/platform-sdk';
import { loaderState, toastState } from '@state/state';

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

  async createAnonymousCart() {
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

  async addToCart(cartId: string, productId: string) {
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

  public async getCart(): Promise<ClientResponse<Cart>> {
    return this.customerBuilder.me().activeCart().get().execute();
  }
}

export default CartApi;
