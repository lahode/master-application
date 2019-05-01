import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { shareReplay, map, catchError } from 'rxjs/operators';

import { EndpointsService } from '../../../core/services/endpoints';
import { ErrorHandlerService } from '../../../core/services/errorhandler.service';
import { PagerService } from '../../../core/services/pager.service';

@Injectable()
export class UserService {

  constructor(private readonly _http: HttpClient,
              private readonly _endpoints: EndpointsService,
              private readonly _error: ErrorHandlerService,
              private readonly _pager: PagerService) {}

  // List all users or a range of users.
  public list(payload: any): Observable<any> {
    let field = null;
    let value = null;
    let sort = '';
    if (payload.sort && payload.sort.active && payload.sort.direction) {
      const sortField = payload.sort.active;
      sort = payload.sort.direction === 'desc' ? `-${sortField}` : sortField;
    }
    if (payload.filter && payload.filter.field && payload.filter.value) {
      field = payload.filter.field;
      value = payload.filter.value;
    }
    if (payload.range) {
      return this._http.get(this._endpoints.userList(this._pager.getFromTo(payload.range), sort, field, value))
        .pipe(
          shareReplay(),
          map(users => <any>(users as any).data),
          catchError(err => throwError(this._error.errorHTTP(err)))
        );
    } else {
      return of(null);
    }
  }

  // Get user detail by ID.
  public all(): Observable<any> {
    return this._http.get(this._endpoints.userAll())
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Get user detail by ID.
  public get(id: string): Observable<any> {
    return this._http.get(this._endpoints.userDetail(id))
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data.user),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Get all users like search value.
  public getLike(search: string): Observable<any> {
    return this._http.get(this._endpoints.userAll(search))
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Get user profile  detail by ID.
  public getProfile(): Observable<any> {
    return this._http.get(this._endpoints.userProfileDetail())
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data.user),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Create a new user.
  public create(values: any): Observable<any> {
    return this._http.post(this._endpoints.userCreate(), values)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data.user),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  //  Update an existing user.
  public update(values: any): Observable<any> {
    return this._http.post(this._endpoints.userUpdate(), values)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data.user),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  //  Update own profile.
  public updateProfile(values: any): Observable<any> {
    return this._http.post(this._endpoints.userProfileUpdate(), values)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data.user),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Remove a user by ID.
  public remove(id: string): Observable<any> {
    return this._http.get(this._endpoints.userRemove(id))
      .pipe(
        shareReplay(),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Reset the authentication method of a user by ID.
  public reset(id: string): Observable<any> {
    return this._http.get(this._endpoints.userReset(id))
      .pipe(
        shareReplay(),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

}
