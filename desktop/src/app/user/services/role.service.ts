import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointsService } from '../../../core/services/endpoints';

@Injectable()
export class RoleService {

  constructor(private readonly authHttp: AuthHttp,
              private readonly endpoints: EndpointsService) {}

  // List all roles
  public list(): Observable<any> {
    return this.authHttp.get(this.endpoints.roleList())
      .map(response => response.json().roles)
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // List all permissions
  public getPermissions(): Observable<any> {
    return this.authHttp.get(this.endpoints.getPermissions())
      .map(response => response.json().permissions)
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Get role detail by ID
  public get(id: string): Observable<any> {
    return this.authHttp.get(this.endpoints.roleDetail(id))
      .map(response => response.json().role)
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Create role
  public create(values: any): Observable<any> {
    return this.authHttp.post(this.endpoints.roleCreate(), values)
      .map(response => response.json().role)
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Update role
  public update(values: any): Observable<any> {
    return this.authHttp.post(this.endpoints.roleUpdate(), values)
      .map(response => response.json().role)
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Remove role
  public remove(id: string): Observable<any> {
    return this.authHttp.get(this.endpoints.roleRemove(id))
      .map(response => response.json())
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Manage back-end error
  private _manageError(err) {
    const error = err.json();
    if (error.hasOwnProperty('message') && error.message) {
      return error.message;
    }
    return 'Erreur de connexion avec le serveur';
  }

}
