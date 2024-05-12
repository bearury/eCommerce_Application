import Api, { projectKey } from '@api/api';
import { ByProjectKeyRequestBuilder, CustomerDraft, CustomerSignin } from '@commercetools/platform-sdk';

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

  async register(user: CustomerDraft) {
    try {
      return await this.customerBuilder.customers().post({ body: user }).execute();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default Auth;
