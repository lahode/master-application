import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';

import { AuthService } from './auth.service';
import { EndpointsService } from '../../../core/services/endpoints';
import { StorageService } from '../../../core/services/storage.service';

const STORAGE_ITEM = 'jwt';

@Injectable()
export class AuthTokenService extends AuthService {

  constructor(private readonly http: HttpClient,
              private readonly endpoints: EndpointsService,
              private readonly storage: StorageService,
              private readonly jwtHelper: JwtHelper) {
    super();
  }

  // Check authentification.
  public checkAuth(): Observable<any> {
    return Observable.fromPromise(this.storage.get(STORAGE_ITEM)).mergeMap(jwt => {
      // If storage is not found.
      if (!jwt || this.jwtHelper.isTokenExpired(jwt)) {
        this.storage.remove(STORAGE_ITEM).then(() => true);
        return Observable.of(false);
      }

      return this.http.get(this.endpoints.checkAuth())
        .shareReplay()
        .map(response => {
          this.jwtHelper.decodeToken(jwt)
          return response;
        })
        .catch(err => {
          this.storage.remove(STORAGE_ITEM).then(() => true);
          return Observable.throw(this._manageError(err))}
        );
    });
  }

  // Return the token as Observable.
  public getToken(): Observable<string> {
    return Observable.fromPromise(StorageService.getItem(STORAGE_ITEM));
  }

  // Check permissions.
  public checkPermissions(permissions: string[]): Observable<any> {
    return this.http.post(this.endpoints.checkPermissions(), permissions)
      .shareReplay()
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Log in.
  public login(values: any): Observable<any> {
    return this.http.post(this.endpoints.login(), values)
      .shareReplay()
      .switchMap(jwt => this.handleJwtResponse((jwt as any).user.token))
      .catch(err => {
        this.storage.remove(STORAGE_ITEM).then(() => true);
        return Observable.throw(this._manageError(err))}
      );
  }

  // Log out.
  public logout(): Observable<any> {
    return Observable.fromPromise(this.storage.remove(STORAGE_ITEM).then(() => true));
  }

  // Sign up.
  public signup(values: any): Observable<any> {
    return this.http.post(this.endpoints.signup(), values)
      .shareReplay()
      .switchMap(jwt => this.handleJwtResponse((jwt as any).user.token))
      .catch(err => Observable.throw(this._manageError(err)));
  }

  // Retrieve password.
  public retrievePassword(values: any): Observable<any> {
    return this.http.post(this.endpoints.getPassword(), values)
      .shareReplay()
      .switchMap(jwt => this.handleJwtResponse((jwt as any).user.token))
      .catch(err => Observable.throw(this._manageError(err)));
  }

  // Save JWT Token and return user object.
  private handleJwtResponse(jwt: string): Observable<any> {
    return Observable.from(
      this.storage.set('jwt', jwt)
        .then(
          () => this.jwtHelper.decodeToken(jwt),
          (err) => this._manageError(err)
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
      .mergeMap(token => {
        if (token) {
          // Clone and modify the request with the token retrieved from the storage.
          request = request.clone({
              setHeaders: {
                  Authorization: `Bearer ${token}`
              }
          });
        }
        return next.handle(request);
      });
  }
}
