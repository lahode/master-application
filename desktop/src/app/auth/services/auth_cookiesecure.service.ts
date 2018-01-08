import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { EndpointsService } from '../../../core/services/endpoints';

@Injectable()
export class AuthService {

  constructor(private readonly http: HttpClient,
              private readonly endpoints: EndpointsService) {}

  // Check authentification
  public checkAuth(): Observable<any> {
    return this.http.get(this.endpoints.checkAuth())
      .shareReplay()
      .catch(err => Observable.throw(this._manageError(err)));
  }

  // Check permissions
  public checkPermissions(permissions: string[]): Observable<any> {
    return this.http.post(this.endpoints.checkPermissions(), permissions)
      .shareReplay()
      .catch(err => Observable.throw(this._manageError(err)));
  }

  // Log in
  public login(values: any): Observable<any> {
    return this.http.post(this.endpoints.login(), values)
      .shareReplay()
      .catch(err => Observable.throw(this._manageError(err)));
  }

  // Log out
  public logout(): Observable<any> {
    return this.http.post(this.endpoints.logout(), null)
      .shareReplay()
      .catch(err => Observable.throw(this._manageError(err)));
  }

  // Sign up
  public signup(values: any): Observable<any> {
    return this.http.post(this.endpoints.signup(), values)
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
