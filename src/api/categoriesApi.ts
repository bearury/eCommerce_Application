import Api, { projectKey } from '@api/api.ts';
import { ByProjectKeyRequestBuilder, CategoryPagedQueryResponse, ClientResponse } from '@commercetools/platform-sdk';

class CategoriesApi {
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

  async get(): Promise<ClientResponse<CategoryPagedQueryResponse>> {
    return this.customerBuilder
      .categories()
      .get({
        queryArgs: { limit: 100 },
      })
      .execute();
  }
}

export default CategoriesApi;
