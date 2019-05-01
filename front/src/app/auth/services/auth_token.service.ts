import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, from, throwError } from 'rxjs';
import { shareReplay, map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';

import { AuthService } from './auth.service';
import { EndpointsService } from '../../../core/services/endpoints';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from '../../../core/services/storage.service';
import { ErrorHandlerService } from '../../../core/services/errorhandler.service';

const STORAGE_ITEM = 'access_token';
const STORAGE_TYPE = 'jwt';
const ACCESS_TYPE = 'access_type';
const RESETAUTH = 'reset_auth';

@Injectable()
export class AuthTokenService extends AuthService {

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
          // If storage is not found destroy existing auth tokens and return false.
          if (!jwt || this._jwtHelper.isTokenExpired(jwt)) {
            this._destroyTokens();
            return of(false);
          }

          // Check if user is authenticate in the backend.
          return fromPromise(this._storage.get(RESETAUTH))
            .pipe(
              mergeMap(reset_auth => {
                return this._http.get(this._endpoints.checkAuth(reset_auth))
                  .pipe(
                    shareReplay(),
                    map(response => (response as any).data.user),
                    catchError(err => {
                      // Destroy existing auth tokens on error.
                      this._destroyTokens();
                      return throwError({code: err.status, message: this._error.errorHTTP(err)});
                    })
                  );
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
        map(response => (response as any).data),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Log in.
  public login(values: any): Observable<any> {
    return this._http.post(this._endpoints.login(), values)
      .pipe(
        shareReplay(),
        switchMap(jwt => this.handleJwtResponse((jwt as any).data.token, (jwt as any).data.user)),
        catchError(err => {
          this._storage.remove(STORAGE_ITEM).then(() => true);
          return throwError(this._error.errorHTTP(err));
        })
      );
  }

  // Log out.
  public logout(): Observable<any> {
    return fromPromise(this._storage.remove(STORAGE_ITEM).then(() => true));
  }

  // Connect to app.
  public connect(): Observable<any> {
    return of(null);
  }

  // Sign up.
  public signup(values: any): Observable<any> {
    return this._http.post(this._endpoints.signup(), values)
      .pipe(
        shareReplay(),
        switchMap(jwt => this.handleJwtResponse((jwt as any).data.token, (jwt as any).data.user)),
        catchError(err => {
          this._storage.remove(STORAGE_ITEM).then(() => true);
          return throwError(this._error.errorHTTP(err));
        })
      );
  }

  // Retrieve password.
  public retrievePassword(values: any): Observable<any> {
    return this._http.post(this._endpoints.getPassword(), values)
      .pipe(
        shareReplay(),
        map(response => (response as any).data),
        catchError(err => {
          this._storage.remove(STORAGE_ITEM).then(() => true);
          return throwError(this._error.errorHTTP(err));
        })
      );
  }

  // Retrieve password.
  public resetPassword(values: any): Observable<any> {
    return this._http.post(this._endpoints.resetPassword(), values)
      .pipe(
        shareReplay(),
        switchMap(jwt => this.handleJwtResponse((jwt as any).data.token, (jwt as any).data.user)),
        catchError(err => {
          this._storage.remove(STORAGE_ITEM).then(() => true);
          return throwError(this._error.errorHTTP(err));
        })
      );
  }

  // Destroy tokens and deconnect.
  private _destroyTokens() {
    this._storage.remove(STORAGE_ITEM).then(() => true);
    this._storage.remove(ACCESS_TYPE).then(() => true);
    this._storage.remove(RESETAUTH).then(() => true);
  }

  public handleAuthentication(): Promise<any> { return Promise.resolve(null); }

  // Save JWT Token and return user object.
  private handleJwtResponse(jwt: string, user: any): Observable<any> {
    if (!jwt) {
      return of(null);
    }
    return from(
      Promise.all([
        this._storage.set(STORAGE_ITEM, jwt)
          .then(
            () => user,
            (err) => throwError(this._error.errorHTTP(err))
          ),
        this._storage.set(ACCESS_TYPE, STORAGE_TYPE)
          .then(
            () => null,
            (err) => throwError(this._error.errorHTTP(err))
          )
      ]).then((array) => array[0])
    );
  }

  // Return the token as Observable.
  public getToken(): Observable<string> {
    return fromPromise(
      Promise.all([
        StorageService.getItem(STORAGE_ITEM),
        StorageService.getItem(ACCESS_TYPE)
      ]).then(result => result.join('|'))
    );
  }

}

/**
 * Token interceptor.
 *
 * Use to add auth tokens on http requests.
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth: AuthTokenService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.auth.getToken()
      .pipe(
        mergeMap(token => {
          if (token) {
            // Clone and modify the request with the token retrieved from the storage.
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
          }
          return next.handle(request);
        })
      );
  }
}
