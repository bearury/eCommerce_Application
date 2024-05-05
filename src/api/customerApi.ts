import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import Api, { projectKey } from './api';

class CustomerApi extends Api {
  private readonly customerBuilder: ByProjectKeyRequestBuilder;

  constructor() {
    super();
    this.customerBuilder = this.apiRoot.withProjectKey({ projectKey });
  }

  async getAllCustomers() {
    try {
      const customers = await this.customerBuilder.customers().get().execute();
      return customers;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCustomer(customerID: string) {
    try {
      const customer = await this.customerBuilder.customers().withId({ ID: customerID }).get().execute();
      return customer;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createCustomer(email: string, password: string) {
    try {
      const customer = await this.customerBuilder
        .customers()
        .post({
          body: {
            email: email,
            password: password,
          },
        })
        .execute();
      return customer;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default CustomerApi;
