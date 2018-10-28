import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from, throwError } from 'rxjs';
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
const TOKEN_STORAGE = 'token_id';
const EXPIREAT = 'expireat';


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
    return fromPromise(this._storage.get(STORAGE_ITEM))
      .pipe(
        mergeMap(jwt => {
          // If storage is not found.
          if (!jwt || this._jwtHelper.isTokenExpired(jwt)) {
            this._destroyTokens();
            return of(false);
          }

          return this._http.get(this._endpoints.checkAuth())
            .pipe(
              shareReplay(),
              map(response => (response as any).user),
              catchError(err => {
                this._destroyTokens();
                return throwError(this._manageError(err));
              })
            );
        })
      );
  }

  // Check permissions.
  public checkPermissions(permissions: string[]): Observable<any> {
    return this._http.post(this._endpoints.checkPermissions(), permissions)
      .pipe(
        shareReplay(),
        catchError(err => throwError(this._manageError(err)))
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

  // Looks for the result of authentication in the URL hash.
  public handleAuthentication(): any {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this._setSession(authResult);
        return false;
      } else if (err) {
        return this._manageError(err);
      }
    });
  }

  // Sign up.
  public signup(values: any): Observable<any> {
    return this._http.post(this._endpoints.signup(), values)
      .pipe(
        shareReplay(),
        catchError(err => {
          this._destroyTokens();
          return throwError(this._manageError(err));
        })
      );
  }

  // Retrieve password.
  public retrievePassword(): Observable<any> {
    return of(null);
  }

  // Destroy tokens and deconnect.
  private _destroyTokens() {
    this._storage.remove(TOKEN_STORAGE).then(() => true);
    this._storage.remove(STORAGE_ITEM).then(() => true);
    this._storage.remove(EXPIREAT).then(() => true);
  }

  // Manage back-end error.
  private _manageError(err) {
    const error = err.error;
    if (error.hasOwnProperty('message') && error.message) {
      return error.message;
    }
    return 'Erreur de connexion avec le serveur';
  }

  private _setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    this._storage.set(TOKEN_STORAGE, authResult.accessToken).then(() => true);
    this._storage.set(STORAGE_ITEM, authResult.idToken).then(() => true);
    this._storage.set(EXPIREAT, expiresAt).then(() => true);
  }

  // Get authO config in the environment file.
  private _getConfig() {
    return <any>environment.authentication.value;
  }

}
