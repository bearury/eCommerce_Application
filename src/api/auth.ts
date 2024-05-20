import { apiInstance, projectKey, session } from '@api/api';
import { ByProjectKeyRequestBuilder, CustomerDraft, CustomerSignin } from '@commercetools/platform-sdk';
import { authState, toastState } from '@state/state';

class Auth {
  private readonly customerBuilder: ByProjectKeyRequestBuilder;

  constructor() {
    this.customerBuilder = session.withProjectKey({ projectKey });
  }

  async login(user: CustomerSignin) {
    try {
      const data = await this.customerBuilder.login().post({ body: user }).execute();

      if (data.statusCode === 200) {
        localStorage.setItem('isAuthorized', 'true');
        localStorage.setItem('email', user.email);
        localStorage.setItem('password', user.password);
        apiInstance.createAuthenticatedSession(user);
        authState.getState().setIsAuthorized(true);
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        authState.getState().setIsAuthorized(false);
        console.error(error);
      }
    }
  }

  async register(user: CustomerDraft) {
    try {
      const data = await this.customerBuilder.customers().post({ body: user }).execute();
      if (user.password) {
        if (data.statusCode === 201) {
          localStorage.setItem('email', user.email);
          localStorage.setItem('password', user.password);
          await this.login({ email: user.email, password: user.password });
          return data;
        } else {
          console.log(data);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        let message = 'Something went wrong during the registration process, please try again later';
        if (error.message === 'There is already an existing customer with the provided email.') {
          message =
            'An account with the provided email address already exists, please log in or use another email address.';
        }
        toastState.getState().toast.showError(message);
        console.error(error);
      }
    }
  }
}

export default Auth;
