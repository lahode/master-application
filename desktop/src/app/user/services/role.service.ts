import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { shareReplay, map, catchError } from 'rxjs/operators';

import { EndpointsService } from '../../../core/services/endpoints';

@Injectable()
export class RoleService {

  constructor(private readonly http: HttpClient,
              private readonly endpoints: EndpointsService) {}

  // List all roles
  public list(): Observable<any> {
    return this.http.get(this.endpoints.roleList())
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).roles),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // List all permissions
  public getPermissions(): Observable<any> {
    return this.http.get(this.endpoints.getPermissions())
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).permissions),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Get role detail by ID
  public get(id: string): Observable<any> {
    return this.http.get(this.endpoints.roleDetail(id))
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).role),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Create role
  public create(values: any): Observable<any> {
    return this.http.post(this.endpoints.roleCreate(), values)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).role),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Update role
  public update(values: any): Observable<any> {
    return this.http.post(this.endpoints.roleUpdate(), values)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).role),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Remove role
  public remove(id: string): Observable<any> {
    return this.http.get(this.endpoints.roleRemove(id))
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
