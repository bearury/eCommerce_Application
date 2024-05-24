import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

export class LocalStorageTokenCache implements TokenCache {
  get(): TokenStore {
    const token = localStorage.getItem('authToken') || '';
    const expirationTime = localStorage.getItem('authTokenExpiration') || '0';
    const refreshToken = localStorage.getItem('refreshToken') || '';
    return {
      token,
      expirationTime: Number(expirationTime),
      refreshToken,
    };
  }

  set(tokenStore: TokenStore): void {
    localStorage.setItem('authToken', tokenStore.token);
    localStorage.setItem('authTokenExpiration', tokenStore.expirationTime.toString());
    localStorage.setItem('refreshToken', tokenStore.refreshToken || '');
  }

  delete(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiration');
    localStorage.removeItem('refreshToken');
  }
}
