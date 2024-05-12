import Api, { projectKey } from '@api/api';
import {
  ByProjectKeyRequestBuilder,
  ClientResponse,
  CustomerDraft,
  CustomerSignin,
  CustomerSignInResult,
} from '@commercetools/platform-sdk';

class Auth extends Api {
  private readonly customerBuilder: ByProjectKeyRequestBuilder;

  constructor() {
    super();
    this.customerBuilder = this.apiRoot.withProjectKey({ projectKey });
  }

  async login(user: CustomerSignin): Promise<ClientResponse<CustomerSignInResult>> {
    return this.customerBuilder.login().post({ body: user }).execute();
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
