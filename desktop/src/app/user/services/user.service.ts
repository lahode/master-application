import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointsService } from '../../../core/services/endpoints';
import { Range } from 'core/models/range';

@Injectable()
export class UserService {

  constructor(private readonly http: HttpClient,
              private readonly endpoints: EndpointsService) {}

  // List all users or a range of users
  public list(range?: Range): Observable<any> {
    return this.http.get(this.endpoints.userList(range))
      .shareReplay()
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Get user detail by ID
  public get(id: string): Observable<any> {
    return this.http.get(this.endpoints.userDetail(id))
      .shareReplay()
      .map(response => (response as any).user)
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Create user
  public create(values: any): Observable<any> {
    return this.http.post(this.endpoints.userCreate(), values)
      .shareReplay()
      .map(response => (response as any).user)
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Update user
  public update(values: any): Observable<any> {
    return this.http.post(this.endpoints.userUpdate(), values)
      .shareReplay()
      .map(response => (response as any).user)
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Remove user
  public remove(id: string): Observable<any> {
    return this.http.get(this.endpoints.userRemove(id))
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
