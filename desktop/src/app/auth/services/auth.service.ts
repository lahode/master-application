import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { JwtHelper, AuthHttp } from 'angular2-jwt';
import { EndpointsService } from '../../../core/services/endpoints';
import { StorageService } from '../../../core/services/storage.service';
// import { AppProviders } from '../../../../core/app-state-module';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';

const STORAGE_ITEM = 'jwt';

@Injectable()
export class AuthService {

  constructor(private readonly authHttp: AuthHttp,
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
        .map(response => this.jwtHelper.decodeToken(jwt))
        .catch(err => {
          this.storage.remove(STORAGE_ITEM).then(() => true);
          return Observable.throw(this._manageError(err))}
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
        return Observable.throw(this._manageError(err))}
      );
  }

  // Log out
  public logout(): Observable<any> {
    return Observable.fromPromise(this.storage.remove(STORAGE_ITEM).then(() => true));
  }

  // Sign up
  public signup(values: any): Observable<any> {
    return this.http.post(this.endpoints.getSignup(), values)
      .map(response => response.json())
      .switchMap(jwt => this.handleJwtResponse(jwt.token))
      .catch(err => Observable.throw(this._manageError(err)));
  }

  // Retrieve password
  public retrievePassword(values: any): Observable<any> {
    return this.http.post(this.endpoints.getPassword(), values)
      .map(response => response.json())
      .switchMap(jwt => this.handleJwtResponse(jwt.token))
      .catch(err => Observable.throw(this._manageError(err)));
  }

  // Save JWT Token and return user object
  private handleJwtResponse(jwt: string): Observable<any> {
    return Observable.from(
      this.storage.set('jwt', jwt)
        .then(
          () => this.jwtHelper.decodeToken(jwt),
          (err) => this._manageError(err)
        )
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
