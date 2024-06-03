import { ByProjectKeyRequestBuilder, ClientResponse, Customer } from '@commercetools/platform-sdk';
import Api, { projectKey } from './api';

class CustomerApi {
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

  /* async getAllCustomers(): Promise<ClientResponse<CustomerPagedQueryResponse>> {
    try {
      return await this.customerBuilder.customers().get().execute();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }*/

  async getCustomer(customerID: string): Promise<ClientResponse<Customer>> {
    try {
      const customer = await this.customerBuilder.customers().withId({ ID: customerID }).get().execute();
      console.log(customer);
      return customer;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default CustomerApi;
