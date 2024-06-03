import { ApiRoot, createApiBuilderFromCtpClient, CustomerSignin } from '@commercetools/platform-sdk';
import {
  AnonymousAuthMiddlewareOptions,
  ClientBuilder,
  type HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  TokenCache,
} from '@commercetools/sdk-client-v2';
import { LocalStorageTokenCache } from './tokenCache';
import { authState } from '@state/state';

export const projectKey = import.meta.env.VITE_Project_key;

export const isAuthorized = localStorage.getItem('isAuthorized');
export const email = localStorage.getItem('email') || '';
export const password = localStorage.getItem('password') || '';
export const user = {
  email: email,
  password: password,
};

class Api {
  private authUrl: string;

  private apiUrl: string;

  private clientId: string;

  private clientSecret: string;

  private scopes: string;

  private clientBuilder: ClientBuilder;

  private httpMiddlewareOptions: HttpMiddlewareOptions;

  private tokenCache: TokenCache;

  private apiInstance: ApiRoot;

  constructor() {
    this.authUrl = import.meta.env.VITE_Auth_url;
    this.apiUrl = import.meta.env.VITE_API_url;
    this.clientId = import.meta.env.VITE_Client_id;
    this.clientSecret = import.meta.env.VITE_Secret;
    this.scopes = import.meta.env.VITE_Scopes;
    this.httpMiddlewareOptions = {
      host: this.apiUrl,
      fetch,
    };
    this.tokenCache = new LocalStorageTokenCache();
    this.clientBuilder = new ClientBuilder().withHttpMiddleware(this.httpMiddlewareOptions);
    this.apiInstance = isAuthorized ? this.createAuthenticatedSession(user) : this.createAnonymousSession();
    this.apiInstance.withProjectKey({ projectKey }).get().execute();
  }

  createAnonymousSession(): ApiRoot {
    const options: AnonymousAuthMiddlewareOptions = {
      host: this.authUrl,
      projectKey,
      credentials: {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      },
      scopes: this.scopes.split(' '),
      fetch,
      tokenCache: this.tokenCache,
    };
    const client = this.clientBuilder.withAnonymousSessionFlow(options).withLoggerMiddleware().build();
    authState.getState().setIsAuthorized(false);
    const apiInstance = createApiBuilderFromCtpClient(client);
    this.apiInstance = apiInstance;
    return apiInstance;
  }

  createAuthenticatedSession(user: CustomerSignin): ApiRoot {
    const passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
      host: this.authUrl,
      projectKey,
      credentials: {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        user: {
          username: user.email,
          password: user.password,
        },
      },
      scopes: this.scopes.split(' '),
      fetch,
      tokenCache: this.tokenCache,
    };
    const client = this.clientBuilder.withPasswordFlow(passwordAuthMiddlewareOptions).withLoggerMiddleware().build();
    localStorage.setItem('isAuthorized', 'true');
    authState.getState().setIsAuthorized(true);
    return createApiBuilderFromCtpClient(client);
  }

  setClient(newClient: ApiRoot) {
    this.apiInstance = newClient;
  }

  getClient(): ApiRoot {
    return this.apiInstance;
  }
}

export const apiInstance = new Api();
export default Api;
