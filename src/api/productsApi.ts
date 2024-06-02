import Api, { projectKey } from '@api/api.ts';
import {
  ByProjectKeyRequestBuilder,
  ClientResponse,
  Product,
  ProductProjectionPagedSearchResponse,
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

  // async get(page: number): Promise<ClientResponse<ProductPagedQueryResponse>> {
  //   const countProducts = 12;
  //   return this.customerBuilder
  //     .products()
  //     .get({ queryArgs: { limit: countProducts, offset: page * countProducts } })
  //     .execute();
  // }

  async getOne(id: string): Promise<ClientResponse<Product>> {
    return this.customerBuilder.products().withId({ ID: id }).get().execute();
  }

  async get(page: number): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> {
    const countProducts = 12;
    return this.customerBuilder
      .productProjections()
      .search()
      .get({ queryArgs: { limit: countProducts, offset: page * countProducts } })
      .execute();
  }
}

export default ProductsApi;
