import Api, { projectKey } from '@api/api';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

class ProductCard {
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
      await this.customerBuilder
        .carts()
        .post({
          body: {
            currency: 'EUR',
          },
        })
        .execute();
      console.log('anon card created');
    } catch (error) {
      console.error(error);
    }
  }
}

export default ProductCard;
