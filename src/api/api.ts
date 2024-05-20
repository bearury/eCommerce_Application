import { ApiRoot, createApiBuilderFromCtpClient, CustomerSignin } from '@commercetools/platform-sdk';
import {
  AnonymousAuthMiddlewareOptions,
  ClientBuilder,
  PasswordAuthMiddlewareOptions,
  TokenCache,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { LocalStorageTokenCache } from './tokenCache';
import Auth from './auth';
import { authState } from '@state/state';

export const projectKey = import.meta.env.VITE_Project_key;

export const isAuthorized = localStorage.getItem('isAuthorized');
export const email = localStorage.getItem('email') || '';
export const password = localStorage.getItem('password') || '';
export const user = {
  email: email,
  password: password,
};

export class Api {
  private authUrl: string;

  private apiUrl: string;

  private clientId: string;

  private clientSecret: string;

  private scopes: string;

  private clientBuilder: ClientBuilder;

  private httpMiddlewareOptions: HttpMiddlewareOptions;

  private authMiddlewareOptions: AuthMiddlewareOptions;

  private tokenCache: TokenCache;

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
    this.authMiddlewareOptions = {
      host: this.authUrl,
      projectKey,
      credentials: {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      },
      scopes: this.scopes.split(' '),
      fetch,
    };
    this.clientBuilder = new ClientBuilder().withHttpMiddleware(this.httpMiddlewareOptions).withLoggerMiddleware();
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
    const client = this.clientBuilder.withAnonymousSessionFlow(options).build();
    authState.getState().setIsAuthorized(false);
    return createApiBuilderFromCtpClient(client);
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

    const client = this.clientBuilder.withPasswordFlow(passwordAuthMiddlewareOptions).build();
    localStorage.setItem('isAuthorized', 'true');
    authState.getState().setIsAuthorized(true);
    return createApiBuilderFromCtpClient(client);
  }
}
export const apiInstance = new Api();
export const session = isAuthorized
  ? apiInstance.createAuthenticatedSession(user)
  : apiInstance.createAnonymousSession();
export const auth = new Auth();
export default Api;
