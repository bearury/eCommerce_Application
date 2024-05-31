import Api, { projectKey } from '@api/api';
import { ByProjectKeyRequestBuilder, Product, ClientResponse } from '@commercetools/platform-sdk';

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

  async getProductByID(id: string): Promise<ClientResponse<Product>> {
    return this.customerBuilder.products().withId({ ID: id }).get().execute();
  }
}

export default ProductCard;
