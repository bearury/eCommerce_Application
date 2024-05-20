import { apiInstance, projectKey, session } from '@api/api';
import { ByProjectKeyRequestBuilder, CustomerDraft, CustomerSignin } from '@commercetools/platform-sdk';
import { authState, loaderState, toastState } from '@state/state';

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
      loaderState.getState().loader.show();
      const data = await this.customerBuilder.customers().post({ body: user }).execute();
      if (user.password) {
        if (data.statusCode === 201) {
          console.log(data.body);
          console.log('User created');
          toastState.getState().toast.showSuccess('Registration successful');
          localStorage.setItem('email', user.email);
          localStorage.setItem('password', user.password);
          await this.login({ email: user.email, password: user.password });
        }
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        toastState.getState().toast.showError(error.message);
        console.error(error);
      }
    } finally {
      loaderState.getState().loader.close();
    }
  }
}

export default Auth;
