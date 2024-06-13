import Api, { projectKey } from '@api/api';
import { ByProjectKeyRequestBuilder, CartAddLineItemAction, CartUpdate } from '@commercetools/platform-sdk';
import { loaderState, toastState } from '@state/state';

class Cart {
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
          },
        })
        .execute();
      console.log('anon card created', response);
      return response.body.id;
    } catch (error) {
      console.error(error);
    }
  }

  async addToCart(cartId: string, productId: string) {
    try {
      const cartResponse = await this.customerBuilder.carts().withId({ ID: cartId }).get().execute();
      const currentVersion = cartResponse.body.version;

      const requestBody: CartUpdate = {
        version: currentVersion,
        actions: [
          {
            action: 'addLineItem',
            productId: productId,
          } as CartAddLineItemAction,
        ],
      };
      const response = await this.customerBuilder.carts().withId({ ID: cartId }).post({ body: requestBody }).execute();
      localStorage.setItem('cartVersion', `${response.body.version}`);

      return response;
    } catch (error) {
      if (error instanceof Error) {
        const message = 'Something went wrong during the update process, please try again.';
        toastState.getState().toast.showError(message);
        console.error('Error details:', error);
      }
      throw error;
    } finally {
      loaderState.getState().loader.close();
    }
  }
}

export default Cart;
