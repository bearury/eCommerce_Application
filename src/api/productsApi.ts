import Api, { projectKey } from '@api/api.ts';
import { ByProjectKeyRequestBuilder, ClientResponse, ProductPagedQueryResponse } from '@commercetools/platform-sdk';

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

  async get(page: number): Promise<ClientResponse<ProductPagedQueryResponse>> {
    const countProducts = 12;
    return this.customerBuilder
      .products()
      .get({ queryArgs: { limit: countProducts, offset: page === 1 ? page : page * countProducts } })
      .execute();
  }

  async getAttr() {
    // const filterStr = 'variants.price.centAmount: range(20 to 100), variants.attributes.color-filter.key: "black"';
    //
    // const range = 'variants.price.centAmount: range(20 to 950)';

    return this.customerBuilder
      .productProjections()
      .search()
      .get({
        queryArgs: {
          'filter.query': ['variants.attributes.wattage: 10'],
        },
      })
      .execute();
  }
}

export default ProductsApi;
