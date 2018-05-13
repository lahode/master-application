import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, from, throwError } from 'rxjs';
import { shareReplay, map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';

import { AuthService } from './auth.service';
import { EndpointsService } from '../../../core/services/endpoints';
import { JwtHelper } from 'angular2-jwt';
import { StorageService } from '../../../core/services/storage.service';
import { ErrorHandlerService } from '../../../core/services/errorhandler.service';

const STORAGE_ITEM = 'jwt';

@Injectable()
export class AuthTokenService extends AuthService {

  constructor(private readonly _http: HttpClient,
              private readonly _endpoints: EndpointsService,
              private readonly _storage: StorageService,
              private readonly _jwtHelper: JwtHelper,
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
            this._storage.remove(STORAGE_ITEM).then(() => true);
            return of(false);
          }

          return this._http.get(this._endpoints.checkAuth())
            .pipe(
              shareReplay(),
              map(response => {
                this._jwtHelper.decodeToken(jwt);
                return response;
              }),
              catchError(err => {
                this._storage.remove(STORAGE_ITEM).then(() => true);
                return throwError(this._manageError(err));
              })
            );
        })
      );
  }

  // Return the token as Observable.
  public getToken(): Observable<string> {
    return fromPromise(StorageService.getItem(STORAGE_ITEM));
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
        switchMap(jwt => this.handleJwtResponse((jwt as any).user.token)),
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
        switchMap(jwt => this.handleJwtResponse((jwt as any).user.token)),
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
        switchMap(jwt => this.handleJwtResponse((jwt as any).user.token)),
        catchError(err => {
          this._storage.remove(STORAGE_ITEM).then(() => true);
          return throwError(this._manageError(err));
        })
      );
  }

  // Save JWT Token and return user object.
  private handleJwtResponse(jwt: string): Observable<any> {
    return from(
      this._storage.set('jwt', jwt)
        .then(
          () => this._jwtHelper.decodeToken(jwt),
          (err) => throwError(this._manageError(err))
        )
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
