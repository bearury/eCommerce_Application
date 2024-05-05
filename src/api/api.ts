import { ApiRoot, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  ClientBuilder,
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/sdk-client-v2';
export const projectKey = import.meta.env.VITE_Project_key;

class Api {
  protected readonly apiRoot: ApiRoot;

  constructor() {
    const authUrl = import.meta.env.VITE_Auth_url;
    const apiUrl = import.meta.env.VITE_API_url;
    const clientId = import.meta.env.VITE_Client_id;
    const clientSecret = import.meta.env.VITE_Secret;
    const scope = import.meta.env.VITE_Scope;
    const authMiddlewareOptions: AuthMiddlewareOptions = {
      host: authUrl,
      projectKey,
      credentials: {
        clientId,
        clientSecret,
      },
      scopes: [scope],
      fetch,
    };

    const httpMiddlewareOptions: HttpMiddlewareOptions = {
      host: apiUrl,
      fetch,
    };

    const client = new ClientBuilder()
      .withClientCredentialsFlow(authMiddlewareOptions)
      .withHttpMiddleware(httpMiddlewareOptions)
      .withLoggerMiddleware()
      .build();

    this.apiRoot = createApiBuilderFromCtpClient(client);
  }
}

export default Api;
