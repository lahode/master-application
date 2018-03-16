import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { EndpointsService } from '../../../core/services/endpoints';
import { JwtHelper } from 'angular2-jwt';
import { StorageService } from '../../../core/services/storage.service';
import { ErrorHandlerService } from '../../../core/services/errorhandler.service';

@Injectable()
export class AuthCookieService extends AuthService {

  constructor(private readonly _http: HttpClient,
              private readonly _endpoints: EndpointsService,
              private readonly _storage: StorageService,
              private readonly _jwtHelper: JwtHelper,
              private readonly _error: ErrorHandlerService) {
    super();
  }

  // Check authentification
  public checkAuth(): Observable<any> {
    return this._http.get(this._endpoints.checkAuth())
      .shareReplay()
      .catch(err => Observable.throw(this._manageError(err)));
  }

  // Check permissions
  public checkPermissions(permissions: string[]): Observable<any> {
    return this._http.post(this._endpoints.checkPermissions(), permissions)
      .shareReplay()
      .catch(err => Observable.throw(this._manageError(err)));
  }

  // Log in
  public login(values: any): Observable<any> {
    return this._http.post(this._endpoints.login(), values)
      .shareReplay()
      .catch(err => Observable.throw(this._manageError(err)));
  }

  // Log out
  public logout(): Observable<any> {
    return this._http.post(this._endpoints.logout(), null)
      .shareReplay()
      .catch(err => Observable.throw(this._manageError(err)));
  }

  // Sign up
  public signup(values: any): Observable<any> {
    return this._http.post(this._endpoints.signup(), values)
      .shareReplay()
      .catch(err => Observable.throw(this._manageError(err)));
  }

  // Retrieve password
  public retrievePassword(values: any): Observable<any> {
    return Observable.of(false);
  }

  // Manage back-end error
  private _manageError(err) {
    const error = err.error;
    if (error.hasOwnProperty('message') && error.message) {
      return error.message;
    }
    return 'Erreur de connexion avec le serveur';
  }

}
