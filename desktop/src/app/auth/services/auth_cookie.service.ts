import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { shareReplay, catchError } from 'rxjs/operators';

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
      .pipe(
        shareReplay(),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Check permissions
  public checkPermissions(permissions: string[]): Observable<any> {
    return this._http.post(this._endpoints.checkPermissions(), permissions)
    .pipe(
      shareReplay(),
      catchError(err => throwError(this._manageError(err)))
    );
  }

  // Log in
  public login(values: any): Observable<any> {
    return this._http.post(this._endpoints.login(), values)
      .pipe(
        shareReplay(),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Log out
  public logout(): Observable<any> {
    return this._http.post(this._endpoints.logout(), null)
      .pipe(
        shareReplay(),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Sign up
  public signup(values: any): Observable<any> {
    return this._http.post(this._endpoints.signup(), values)
      .pipe(
        shareReplay(),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Retrieve password
  public retrievePassword(values: any): Observable<any> {
    return of(false);
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
