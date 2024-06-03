import Api, { projectKey } from '@api/api.ts';
import {
  ByProjectKeyRequestBuilder,
  ClientResponse,
  ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';
import { SelectBrand, SelectColor } from '@utils/variables.ts';
import { RangeComponentValue } from '@components/range/range';

export interface GetFilterParams {
  color: SelectColor | SelectBrand | '';
  brand: SelectColor | SelectBrand | '';
  price: RangeComponentValue;
  wattage: RangeComponentValue;
}

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

  async get(page: number): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> {
    const countProducts = 12;
    return this.customerBuilder
      .productProjections()
      .search()
      .get({ queryArgs: { limit: countProducts, offset: page === 1 ? page - 1 : page * countProducts } })
      .execute();
  }

  async getFilter(params: GetFilterParams) {
    const filterStr = [];

    if (params.color) {
      filterStr.push(`variants.attributes.color-filter.key: "${params.color}"`);
    }

    if (params.brand) {
      filterStr.push(`variants.attributes.brand: "${params.brand}"`);
    }

    if (params.price.statusCheckbox) {
      filterStr.push(
        `variants.price.centAmount: range(${String(params.price.value.min)} to ${String(params.price.value.max)}00)`
      );
    }

    if (params.wattage.statusCheckbox) {
      filterStr.push(
        `variants.attributes.wattage: range(${String(params.wattage.value.min)} to ${String(params.wattage.value.max)})`
      );
    }

    return this.customerBuilder
      .productProjections()
      .search()
      .get({
        queryArgs: {
          'filter.query': filterStr,
        },
      })
      .execute();
  }
}

export default ProductsApi;
