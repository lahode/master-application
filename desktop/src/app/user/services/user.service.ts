import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointsService } from '../../../core/services/endpoints';
import { Range } from 'core/models/range';

@Injectable()
export class UserService {

  constructor(private readonly authHttp: AuthHttp,
              private readonly endpoints: EndpointsService) {}

  // List all users or a range of users
  public list(range?: Range): Observable<any> {
    return this.authHttp.get(this.endpoints.userList(range))
      .map(response => response.json())
      .catch(err => {
        return Observable.throw(this.manageError(err))}
      );
  }

  // Get user detail by ID
  public get(id: string): Observable<any> {
    return this.authHttp.get(this.endpoints.userDetail(id))
      .map(response => response.json().user)
      .catch(err => {
        return Observable.throw(this.manageError(err))}
      );
  }

  // Create user
  public create(values: any): Observable<any> {
    return this.authHttp.post(this.endpoints.userCreate(), values)
      .map(response => response.json().user)
      .catch(err => {
        return Observable.throw(this.manageError(err))}
      );
  }

  // Update user
  public update(values: any): Observable<any> {
    return this.authHttp.post(this.endpoints.userUpdate(), values)
      .map(response => response.json().user)
      .catch(err => {
        return Observable.throw(this.manageError(err))}
      );
  }

  // Remove user
  public remove(id: string): Observable<any> {
    return this.authHttp.get(this.endpoints.userRemove(id))
      .map(response => response.json())
      .catch(err => {
        return Observable.throw(this.manageError(err))}
      );
  }

  // Manage back-end error
  private manageError(err) {
    if (err.ok === 0 && err.statusText.length === 0) {
      err.statusText = 'Erreur de connexion avec le back-end';
    }
    return err;
  }

}