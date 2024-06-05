import Api, { projectKey } from '@api/api';
import {
  ByProjectKeyRequestBuilder,
  ClientResponse,
  ProductProjectionPagedSearchResponse,
  QueryParam,
} from '@commercetools/platform-sdk';

type QueryParams = {
  [key: string]: QueryParam;
  fuzzy?: boolean | undefined;
  fuzzyLevel?: number | undefined;
  limit?: number;
  sort?: string;
};

class Search {
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

  async search(searchParams: QueryParams): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> {
    return this.customerBuilder.productProjections().search().get({ queryArgs: searchParams }).execute();
  }
}

export default Search;
