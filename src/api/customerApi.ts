import {
  BaseAddress,
  ByProjectKeyRequestBuilder,
  ClientResponse,
  Customer,
  CustomerChangeAddressAction,
  CustomerChangeEmailAction,
  CustomerChangePassword,
  CustomerSetDateOfBirthAction,
  CustomerSetFirstNameAction,
  CustomerSetLastNameAction,
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

  async changeUserInfo(
    customerID: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    email: string
  ): Promise<ClientResponse<Customer>> {
    const requestBody = {
      version: Number(localStorage.getItem('customerVersion')),
      actions: [
        {
          action: 'setFirstName',
          firstName: firstName,
        } as CustomerSetFirstNameAction,
        {
          action: 'setLastName',
          lastName: lastName,
        } as CustomerSetLastNameAction,
        {
          action: 'setDateOfBirth',
          dateOfBirth: dateOfBirth,
        } as CustomerSetDateOfBirthAction,
        {
          action: 'changeEmail',
          email: email,
        } as CustomerChangeEmailAction,
      ],
    };
    try {
      const response = await this.customerBuilder
        .customers()
        .withId({ ID: customerID })
        .post({ body: requestBody })
        .execute();
      localStorage.setItem('customerVersion', `${response.body.version}`);
      toastState.getState().toast.showSuccess('User info changed!');
      return response;
    } catch (error) {
      if (error instanceof Error) {
        const message = 'Something went wrong during the update user info process, please try again.';
        toastState.getState().toast.showError(message);
        console.error(error);
      }
      throw error;
    } finally {
      loaderState.getState().loader.close();
    }
  }

  async changePassword(
    customerID: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ClientResponse<Customer>> {
    const requestBody: CustomerChangePassword = {
      id: customerID,
      version: Number(localStorage.getItem('customerVersion')),
      currentPassword: oldPassword,
      newPassword: newPassword,
    };
    try {
      const response = await this.customerBuilder.customers().password().post({ body: requestBody }).execute();
      localStorage.setItem('customerVersion', `${response.body.version}`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        const message = 'Something went wrong during the update password process, please check your inputs.';
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
