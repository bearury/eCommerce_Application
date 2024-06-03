import {
  BaseAddress,
  ByProjectKeyRequestBuilder,
  ClientResponse,
  Customer,
  CustomerChangeAddressAction,
} from '@commercetools/platform-sdk';
import Api, { projectKey } from './api';
import { loaderState, toastState } from '@state/state';

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

  async changeAddress(customerID: string, addressID: string, address: BaseAddress): Promise<ClientResponse<Customer>> {
    const requestBody = {
      version: Number(localStorage.getItem('customerVersion')),
      actions: [
        {
          action: 'changeAddress',
          addressId: addressID,
          address: address,
        } as CustomerChangeAddressAction,
      ],
    };
    try {
      const response = await this.customerBuilder
        .customers()
        .withId({ ID: customerID })
        .post({ body: requestBody })
        .execute();
      localStorage.setItem('customerVersion', `${response.body.version}`);
      toastState.getState().toast.showSuccess('Address changed!');
      return response;
    } catch (error) {
      if (error instanceof Error) {
        const message = 'Something went wrong during the update address process, please try again.';
        toastState.getState().toast.showError(message);
        console.error(error);
      }
      throw error;
    } finally {
      loaderState.getState().loader.close();
    }
  }
}

export default CustomerApi;
