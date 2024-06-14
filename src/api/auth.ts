import { projectKey } from '@api/api';
import { ByProjectKeyRequestBuilder, CustomerDraft, CustomerSignin } from '@commercetools/platform-sdk';
import { authState, loaderState, toastState } from '@state/state';
import { LocalStorageTokenCache } from './tokenCache';
import Api from './api';

class Auth {
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

  async login(user: CustomerSignin) {
    try {
      loaderState.getState().loader.show();
      const anonymousCartId = localStorage.getItem('cartId');
      if (!anonymousCartId) {
        throw new Error('no anon cart id!');
      }
      const data = await this.customerBuilder
        .me()
        .login()
        .post({
          body: {
            email: user.email,
            password: user.password,
            anonymousCartId,
            anonymousCartSignInMode: 'MergeWithExistingCustomerCart',
          } as CustomerSignin,
        })
        .execute();
      if (data.statusCode === 200) {
        localStorage.setItem('isAuthorized', 'true');
        localStorage.setItem('customerID', data.body.customer.id);
        localStorage.setItem('email', user.email);
        localStorage.setItem('password', user.password);
        new LocalStorageTokenCache().delete();
        const newSession = this.apiInstance.createAuthenticatedSession({
          email: user.email,
          password: user.password,
        });
        this.apiInstance.setClient(newSession);
        this.customerBuilder = newSession.withProjectKey({ projectKey });
        const response = await this.customerBuilder.me().activeCart().get().execute();
        localStorage.setItem('cartId', response.body.id);
        localStorage.setItem('cartVersion', `${response.body.version}`);
        authState.getState().setIsAuthorized(true);
        toastState.getState().toast.showSuccess('Welcome');
        return data;
      }
    } catch (error) {
      if (error instanceof Error) {
        let message = 'Something went wrong during login, please try again later';
        if (error.message === 'Account with the given credentials not found.') {
          message = 'Wrong E-mail or password. Please check that the entered data is correct';
        }
        authState.getState().setIsAuthorized(false);
        toastState.getState().toast.showError(message);
        console.error(error);
      }
    } finally {
      loaderState.getState().loader.close();
    }
  }

  async register(user: CustomerDraft) {
    try {
      loaderState.getState().loader.show();
      const data = await this.customerBuilder.customers().post({ body: user }).execute();
      if (data.statusCode === 201 && user.password) {
        toastState.getState().toast.showSuccess('Registration successful');
        localStorage.setItem('email', user.email);
        localStorage.setItem('password', user.password);
        await this.login({ email: user.email, password: user.password });
        return data;
      }
    } catch (error) {
      if (error instanceof Error) {
        let message = 'Something went wrong during the registration process, please try again.';
        if (error.message === 'There is already an existing customer with the provided email.') {
          message =
            'An account with the provided email address already exists, please log in or use another email address.';
        }
        toastState.getState().toast.showError(message);
        console.error(error);
      }
    } finally {
      loaderState.getState().loader.close();
    }
  }
}

export default Auth;
