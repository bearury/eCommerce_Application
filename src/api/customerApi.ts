import {
  ByProjectKeyRequestBuilder,
  ClientResponse,
  Customer,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
} from '@commercetools/platform-sdk';
import Api, { projectKey } from './api';

class CustomerApi extends Api {
  private readonly customerBuilder: ByProjectKeyRequestBuilder;

  constructor() {
    super();
    this.customerBuilder = this.apiRoot.withProjectKey({ projectKey });
  }

  async getAllCustomers(): Promise<ClientResponse<CustomerPagedQueryResponse>> {
    try {
      return await this.customerBuilder.customers().get().execute();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCustomer(customerID: string): Promise<ClientResponse<Customer>> {
    try {
      return await this.customerBuilder.customers().withId({ ID: customerID }).get().execute();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createCustomer(email: string, password: string): Promise<ClientResponse<CustomerSignInResult>> {
    try {
      return await this.customerBuilder
        .customers()
        .post({
          body: {
            email: email,
            password: password,
          },
        })
        .execute();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default CustomerApi;
