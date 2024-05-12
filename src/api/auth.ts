import Api, { projectKey } from '@api/api';
import { ByProjectKeyRequestBuilder, CustomerSignin } from '@commercetools/platform-sdk';

class Auth extends Api {
  private readonly customerBuilder: ByProjectKeyRequestBuilder;

  constructor() {
    super();
    this.customerBuilder = this.apiRoot.withProjectKey({ projectKey });
  }

  async login(user: CustomerSignin) {
    try {
      return await this.customerBuilder.login().post({ body: user }).execute();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async register() {
    try {
      return await this.customerBuilder.login().post({ body: user }).execute();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default Auth;
