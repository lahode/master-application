import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { JwtHelper, AuthHttp } from 'angular2-jwt';
import { EndpointsService } from '../endpoints';
import { StorageService } from '../storage-service/storage.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';

const STORAGE_ITEM = 'jwt';

@Injectable()
export class AuthService {

  constructor(public readonly authHttp: AuthHttp,
              private readonly http: Http,
              private readonly endpoints: EndpointsService,
              private readonly storage: StorageService,
              private readonly jwtHelper: JwtHelper) {}

  // Check authentification
  public checkAuth(): Observable<any> {
    return Observable.fromPromise(this.storage.get(STORAGE_ITEM)).mergeMap(jwt => {
      // If storage is not found
      if (!jwt || this.jwtHelper.isTokenExpired(jwt)) {
        this.storage.remove(STORAGE_ITEM).then(() => true);
        return Observable.of(false);
      }

      return this.authHttp.get(this.endpoints.getAuth())
        .map(response => this.jwtHelper.decodeToken(jwt) /*response.json()*/ )
        .catch(err => {
          this.storage.remove(STORAGE_ITEM).then(() => true);
          return Observable.throw(this.manageError(err))}
        );
    });
  }

  // Log in
  public login(values: any): Observable<any> {
    return this.http.post(this.endpoints.getLogin(), values)
      .map(response => response.json())
      .switchMap(jwt => this.handleJwtResponse(jwt.token))
      .catch(err => {
        this.storage.remove(STORAGE_ITEM).then(() => true);
        return Observable.throw(this.manageError(err))}
      );
  }

  // Log out
  public logout() {
    return Observable.fromPromise(this.storage.remove(STORAGE_ITEM).then(() => true));
  }

  // Sign up
  public signup(values: any): Observable<any> {
    return this.http.post(this.endpoints.getSignup(), values)
      .map(response => response.json())
      .switchMap(jwt => this.handleJwtResponse(jwt.token))
      .catch(err => Observable.throw(this.manageError(err)));
  }

  // Save JWT Token and return user object
  private handleJwtResponse(jwt: string): Observable<any> {
    return Observable.from(
      this.storage.set('jwt', jwt)
        .then(
          () => this.jwtHelper.decodeToken(jwt),
          (err) => this.manageError(err)
        )
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
