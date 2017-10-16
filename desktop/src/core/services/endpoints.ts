import { Injectable, Inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class EndpointsService {

  _apiEndPoint: string;

  constructor() {
    this._apiEndPoint = environment.apiEndpoint;
  }

  getAuth() {
    return this._apiEndPoint + '/api/authenticate';
  }

  getLogin() {
    return this._apiEndPoint + '/login';
  }

  getSignup() {
    return this._apiEndPoint + '/signup';
  }

  getPassword() {
    return this._apiEndPoint + '/retrieve-password';
  }

}
