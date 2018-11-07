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
    return this._http.post(this._endpoints.login(), values)
      .pipe(
        shareReplay(),
        switchMap(jwt => this.handleJwtResponse((jwt as any).token, (jwt as any).user)),
        catchError(err => {
          this._storage.remove(STORAGE_ITEM).then(() => true);
          return throwError(this._manageError(err));
        })
      );
  }

  // Log out.
  public logout(): Observable<any> {
    return fromPromise(this._storage.remove(STORAGE_ITEM).then(() => true));
  }

  // Sign up.
  public signup(values: any): Observable<any> {
    return this._http.post(this._endpoints.signup(), values)
      .pipe(
        shareReplay(),
        switchMap(jwt => this.handleJwtResponse((jwt as any).token, (jwt as any).user)),
        catchError(err => {
          this._storage.remove(STORAGE_ITEM).then(() => true);
          return throwError(this._manageError(err));
        })
      );
  }

  // Retrieve password.
  public retrievePassword(values: any): Observable<any> {
    return this._http.post(this._endpoints.getPassword(), values)
      .pipe(
        shareReplay(),
        switchMap(jwt => this.handleJwtResponse((jwt as any).token, (jwt as any).user)),
        catchError(err => {
          this._storage.remove(STORAGE_ITEM).then(() => true);
          return throwError(this._manageError(err));
        })
      );
  }

  // Destroy tokens and deconnect.
  private _destroyTokens() {
    this._storage.remove(STORAGE_ITEM).then(() => true);
    this._storage.remove('access_type').then(() => true);
  }

  public handleAuthentication(): Promise<any> { return Promise.resolve(null); }

  // Save JWT Token and return user object.
  private handleJwtResponse(jwt: string, user: any): Observable<any> {
    return from(
      Promise.all([
        this._storage.set(STORAGE_ITEM, jwt)
          .then(
            () => user,
            (err) => throwError(this._manageError(err))
          ),
        this._storage.set('access_type', STORAGE_TYPE)
          .then(
            () => null,
            (err) => throwError(this._manageError(err))
          )
      ]).then((array) => array[0])
    );
  }

  // Return the token as Observable.
  public getToken(): Observable<string> {
    return fromPromise(
      Promise.all([
        StorageService.getItem(STORAGE_ITEM),
        StorageService.getItem('access_type')
      ]).then(result => result.join('|'))
    );
  }

  // Manage back-end error.
  private _manageError(err) {
    const error = err.error;
    if (error.hasOwnProperty('message') && error.message) {
      return error.message;
    }
    return 'Erreur de connexion avec le serveur';
  }

}

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
