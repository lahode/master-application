import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { shareReplay, map, catchError } from 'rxjs/operators';

import { EndpointsService } from '../../../core/services/endpoints';

@Injectable()
export class RoleService {

  constructor(private readonly _http: HttpClient,
              private readonly _endpoints: EndpointsService) {}

  // List all roles.
  public list(): Observable<any> {
    return this._http.get(this._endpoints.roleList())
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).roles),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // List all permissions.
  public getPermissions(): Observable<any> {
    return this._http.get(this._endpoints.getPermissions())
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).permissions),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Get role detail by ID.
  public get(id: string): Observable<any> {
    return this._http.get(this._endpoints.roleDetail(id))
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).role),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Create a new role.
  public create(values: any): Observable<any> {
    return this._http.post(this._endpoints.roleCreate(), values)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).role),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Update an existing role.
  public update(values: any): Observable<any> {
    return this._http.post(this._endpoints.roleUpdate(), values)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).role),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Remove a role by ID.
  public remove(id: string): Observable<any> {
    return this._http.get(this._endpoints.roleRemove(id))
      .pipe(
        shareReplay(),
        catchError(err => throwError(this._manageError(err)))
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
