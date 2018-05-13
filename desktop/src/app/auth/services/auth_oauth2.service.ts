import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Headers } from '@angular/http';
import { Observable, of, from, throwError } from 'rxjs';
import { switchMap, catchError, shareReplay, map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { EndpointsService } from '../../../core/services/endpoints';
import { JwtHelper } from 'angular2-jwt';
import { StorageService } from '../../../core/services/storage.service';
import { ErrorHandlerService } from '../../../core/services/errorhandler.service';

import { environment } from '../../../environments/environment';
import { User } from '../../../core/models/user';

const TOKEN_STORAGE = 'auth_token';
const USER_STORAGE = 'auth_user';

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

@Injectable()
export class AuthOAuth2Service extends AuthService {

  constructor(private readonly _http: HttpClient,
              private readonly _endpoints: EndpointsService,
              private readonly _storage: StorageService,
              private readonly _jwtHelper: JwtHelper,
              private readonly _error: ErrorHandlerService) {
    super();
  }

  public refreshToken(): Observable<any> {
    // Check if token is still valid.
    return this._fetchToken('access_token')
      .pipe(
        map((access_token: string) => {
          if (access_token && !this._jwtHelper.isTokenExpired(access_token)) {
            return true;
          } else {
            // Refresh the token if initial token has expired.
            this._fetchToken('refresh_token')
              .pipe(
                map((refresh_token: string) => {
                  if (refresh_token && !this._jwtHelper.isTokenExpired(refresh_token)) {
                    return true;
                  } else {
                    const auth = {
                      refresh_token: refresh_token,
                      client_secret: this._getConfig().auth.client_secret,
                      client_id: this._getConfig().auth.client_id,
                    };
                    return this._getToken('refresh_token', auth);
                  }
                })
              );
          }
        })
      );
  }

  // Check authentification.
  public checkAuth(activeUser): Observable<any> {
    return this.refreshToken()
      .pipe(
        switchMap(token => {
          return from(this._storage.get(TOKEN_STORAGE)
            .then(
              (userStorage) => {
                if (Object.keys(activeUser).length === 0) {
                  activeUser = userStorage;
                }
                const userID = activeUser ? activeUser.id : 0;
                if (userID === 0 || !token) {
                  return of(null);
                }
                return this._http.get(this._endpoints.checkAuth())
                  .pipe(
                    switchMap((user:  User) => {
                      if (user) {
                        return this._setUser(user);
                      } else {
                        this._destroyTokens();
                      }
                    }),
                    catchError(err => {
                      this._destroyTokens();
                      return throwError(this._error.errorHTTP(err));
                    })
                  );
              },
              (err) => throwError(this._error.errorHTTP(err))
            ));
        })
      );
  }

  // Check permissions.
  public checkPermissions(permissions: string[]): Observable<any> {
    return this._http.post(this._endpoints.checkPermissions(), permissions)
      .pipe(
        shareReplay(),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Log in.
  public login(values: any): Observable<any> {
    const auth = {
      grant_type: this._getConfig().grant_type,
      client_id: this._getConfig().client_id,
      client_secret: this._getConfig().client_secret,
      username: values.username,
      password: values.password
    };
    return this._getToken(auth.grant_type, auth)
      .pipe(
        switchMap(token => {
          return this._http.get(this._endpoints.checkAuth())
            .pipe(
              switchMap((user:  User) => {
                if (user) {
                  return this._setUser(user);
                } else {
                  this._destroyTokens();
                }
              }),
              catchError(err => {
                this._destroyTokens();
                return throwError(this._error.errorHTTP(err));
              })
            );
        }),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Log out.
  public logout(): Observable<any> {
    this._http.get(this._endpoints.logout());
    this._destroyTokens();
    return of(true);
  }

  // Sign up.
  public signup(values: any): Observable<any> {
    return of(null);
  }

  // Retrieve password.
  public retrievePassword(values: any): Observable<any> {
    return of(null);
  }

  // Destroy tokens and deconnect.
  private _destroyTokens() {
    this._storage.remove(TOKEN_STORAGE).then(() => true);
    this._storage.remove(USER_STORAGE).then(() => true);
  }

  // Return the token as Observable.
  public _getToken(grant_type?: string, data?: any): Observable<any> {

    if (grant_type && ['client_credentials', 'authorization_code', 'password', 'refresh_token'].indexOf(grant_type) === -1) {
      throw new Error(`Grant type ${grant_type} is not supported`);
    }

    const defaults: any = {
      grant_type: grant_type || 'client_credentials'
    };

    defaults.client_id = this._getConfig().api.key;
    defaults.client_secret = this._getConfig().auth.client_secret;

    const payload = Object.assign(defaults, data);
    const params: string[] = [];
    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        params.push(`${key}=${payload[key]}`);
      }
    }

    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

    return this._http.post(this._getConfig().api.host + '/' + this._getConfig().api.token, params.join('&'), {headers})
      .pipe(
        switchMap((res: AuthResponse) => this._setToken(res)),
        catchError(err => {
          this._destroyTokens();
          return throwError(err);
        })
      );
  }

  // Fetch the token as in the localStorage.
  private _fetchToken(key?: string): any {
    return from(this._storage.get(TOKEN_STORAGE)
      .then(
        (token) => {
          const parsedToken = JSON.parse(token);
          if (key && parsedToken.hasOwnProperty(key)) {
            return parsedToken[key];
          } else if (!key) {
            return parsedToken;
          }
        },
        (err) => throwError(this._error.errorHTTP(err))
      ));
  }

  // Set the token as in the localStorage.
  private _setToken(token: any): Observable<AuthResponse> {
    return from(
      this._storage.set(TOKEN_STORAGE, token)
        .then(
          () => token,
          (err) => throwError(this._error.errorHTTP(err))
        )
      );
  }

  // Set the token as in the localStorage.
  private _setUser(user: any): Observable<User> {
    return from(
      this._storage.set(USER_STORAGE, user)
        .then(
          () => user,
          (err) => throwError(this._error.errorHTTP(err))
        )
      );
  }

  // Get OAuth2 config in the environment file.
  private _getConfig() {
    return <any>environment.authentication.value;
  }

}