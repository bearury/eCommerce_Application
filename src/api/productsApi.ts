import Api, { projectKey } from '@api/api.ts';
import {
  ByProjectKeyRequestBuilder,
  ClientResponse,
  Product,
  ProductPagedQueryResponse,
} from '@commercetools/platform-sdk';

class ProductsApi {
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

  async get(): Promise<ClientResponse<ProductPagedQueryResponse>> {
    return this.customerBuilder
      .products()
      .get({ queryArgs: { limit: 10, offset: 100 } })
      .execute();
  }

  async getOne(id: string): Promise<ClientResponse<Product>> {
    return this.customerBuilder.products().withId({ ID: id }).get().execute();
  }
}

export default ProductsApi;
