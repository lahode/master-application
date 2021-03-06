import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { shareReplay, map, catchError, mergeMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';
import * as auth0 from 'auth0-js';

import { AuthService } from './auth.service';
import { EndpointsService } from '../../../core/services/endpoints';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from '../../../core/services/storage.service';
import { ErrorHandlerService } from '../../../core/services/errorhandler.service';

import { environment } from '../../../environments/environment';

const STORAGE_ITEM = 'access_token';
const STORAGE_TYPE = 'auth0';
const ACCESS_TYPE = 'access_type';
const TOKEN_STORAGE = 'token_id';
const EXPIREAT = 'expireat';
const RESETAUTH = 'reset_auth';

@Injectable()
export class AuthAuth0Service extends AuthService {

  auth0 = new auth0.WebAuth({
    clientID: this._getConfig().client_id,
    domain: this._getConfig().domain,
    responseType: 'token id_token',
    redirectUri: this._getConfig().callback,
    scope: 'openid'
  });

  constructor(private readonly _http: HttpClient,
              private readonly _endpoints: EndpointsService,
              private readonly _storage: StorageService,
              private readonly _jwtHelper: JwtHelperService,
              private readonly _error: ErrorHandlerService) {
    super();
  }

  // Check authentification.
  public checkAuth(): Observable<any> {
    return fromPromise(this._checkJwtAndGetResetToken()).pipe(
      mergeMap(reset_auth => {
        if (reset_auth === -1) {
          return of(false);
        }
        return this._http.get(this._endpoints.checkAuth(reset_auth))
          .pipe(
            shareReplay(),
            map(response => (response as any).data.user),
            catchError(err => {
              // Destroy existing auth tokens on error (if skipDestroyToken is false).
              this._destroyTokens();
              return throwError({code: err.status, message: this._error.errorHTTP(err)});
            })
          );
      }));
  }

  // Check permissions.
  public checkPermissions(permissions: string[]): Observable<any> {
    return this._http.post(this._endpoints.checkPermissions(), permissions)
      .pipe(
        shareReplay(),
        map(response => (response as any).data),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Log in.
  public login(values: any): Observable<any> {
    this.auth0.authorize();
    return of(null);
  }

  // Log out.
  public logout(): Observable<any> {
    this._destroyTokens();
    return of(true);
  }

  // Connect to app.
  public connect(appID = null): Observable<any> {
    return of(null);
  }

  // Looks for the result of authentication in the URL hash.
  public handleAuthentication(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          resolve(this._setSession(authResult).then(() => false));
        } else if (err) {
          reject(this._error.errorHTTP(err));
        } else {
          resolve(false);
        }
      });
    });
  }

  // Sign up.
  public signup(values: any): Observable<any> {
    return this._http.post(this._endpoints.signup(), values)
      .pipe(
        shareReplay(),
        map(response => (response as any).data),
        catchError(err => {
          this._destroyTokens();
          return throwError(this._error.errorHTTP(err));
        })
      );
  }

  // Retrieve password.
  public retrievePassword(): Observable<any> {
    return of(null);
  }

  // Retrieve password.
  public resetPassword(): Observable<any> {
    return of(null);
  }

  // Destroy tokens and deconnect.
  private _destroyTokens() {
    this._storage.remove(TOKEN_STORAGE).then(() => true);
    this._storage.remove(STORAGE_ITEM).then(() => true);
    this._storage.remove(ACCESS_TYPE).then(() => true);
    this._storage.remove(EXPIREAT).then(() => true);
  }

  private _setSession(authResult): Promise<any> {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    return Promise.all([
      this._storage.set(TOKEN_STORAGE, authResult.accessToken).then(() => true),
      this._storage.set(STORAGE_ITEM, authResult.idToken).then(() => true),
      this._storage.set(ACCESS_TYPE, STORAGE_TYPE).then(() => true),
      this._storage.set(EXPIREAT, expiresAt).then(() => true)
    ]);
  }

  // Get authO config in the environment file.
  private _getConfig() {
    return <any>environment.authentication.value;
  }

  // Check if jwt token exists and is not expired and get reset_auth token if exists.
  private async _checkJwtAndGetResetToken() {
    try {
      const jwt = await this._storage.get(STORAGE_ITEM);
      if (!jwt || this._jwtHelper.isTokenExpired(jwt)) {
        this._destroyTokens();
        return -1;
      }
      const reset_auth = await this._storage.get(RESETAUTH);
      return reset_auth;
    } catch (e) {
      return e;
    }
  }

}
