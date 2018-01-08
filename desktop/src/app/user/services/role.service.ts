import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointsService } from '../../../core/services/endpoints';

@Injectable()
export class RoleService {

  constructor(private readonly http: HttpClient,
              private readonly endpoints: EndpointsService) {}

  // List all roles
  public list(): Observable<any> {
    return this.http.get(this.endpoints.roleList())
      .shareReplay()
      .map(response => <any>(response as any).roles)
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // List all permissions
  public getPermissions(): Observable<any> {
    return this.http.get(this.endpoints.getPermissions())
      .shareReplay()
      .map(response => <any>(response as any).permissions)
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Get role detail by ID
  public get(id: string): Observable<any> {
    return this.http.get(this.endpoints.roleDetail(id))
      .shareReplay()
      .map(response => <any>(response as any).role)
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Create role
  public create(values: any): Observable<any> {
    return this.http.post(this.endpoints.roleCreate(), values)
      .shareReplay()
      .map(response => <any>(response as any).role)
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Update role
  public update(values: any): Observable<any> {
    return this.http.post(this.endpoints.roleUpdate(), values)
      .shareReplay()
      .map(response => <any>(response as any).role)
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Remove role
  public remove(id: string): Observable<any> {
    return this.http.get(this.endpoints.roleRemove(id))
      .shareReplay()
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
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
