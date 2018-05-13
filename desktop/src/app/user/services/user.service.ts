import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { shareReplay, map, catchError } from 'rxjs/operators';

import { EndpointsService } from '../../../core/services/endpoints';
import { Range } from '../../../core/models/range';

@Injectable()
export class UserService {

  constructor(private readonly http: HttpClient,
              private readonly endpoints: EndpointsService) {}

  // List all users or a range of users
  public list(range?: Range): Observable<any> {
    return this.http.get(this.endpoints.userList(range))
      .pipe(
        shareReplay(),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Get user detail by ID
  public get(id: string): Observable<any> {
    return this.http.get(this.endpoints.userDetail(id))
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).user),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Create user
  public create(values: any): Observable<any> {
    return this.http.post(this.endpoints.userCreate(), values)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).user),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Update user
  public update(values: any): Observable<any> {
    return this.http.post(this.endpoints.userUpdate(), values)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).user),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // Remove user
  public remove(id: string): Observable<any> {
    return this.http.get(this.endpoints.userRemove(id))
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
