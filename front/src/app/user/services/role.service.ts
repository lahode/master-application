import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { shareReplay, map, catchError } from 'rxjs/operators';

import { EndpointsService } from '../../../core/services/endpoints';
import { ErrorHandlerService } from '../../../core/services/errorhandler.service';

@Injectable()
export class RoleService {

  constructor(private readonly _http: HttpClient,
              private readonly _endpoints: EndpointsService,
              private readonly _error: ErrorHandlerService) {}

  // List all roles.
  public list(): Observable<any> {
    return this._http.get(this._endpoints.roleList())
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data.roles),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // List all permissions.
  public getPermissions(): Observable<any> {
    return this._http.get(this._endpoints.getPermissions())
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data.permissions),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Get role detail by ID.
  public get(id: string): Observable<any> {
    return this._http.get(this._endpoints.roleDetail(id))
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data.role),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Create a new role.
  public create(values: any): Observable<any> {
    return this._http.post(this._endpoints.roleCreate(), values)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data.role),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Update an existing role.
  public update(values: any): Observable<any> {
    return this._http.post(this._endpoints.roleUpdate(), values)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data.role),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Remove a role by ID.
  public remove(id: string): Observable<any> {
    return this._http.get(this._endpoints.roleRemove(id))
      .pipe(
        shareReplay(),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

}
