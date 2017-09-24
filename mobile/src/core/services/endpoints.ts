/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   21-09-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 21-09-2017
 */

import { Injectable, Inject } from '@angular/core';

// import { EnvVariables } from '../environment/environment.token';
// import { IEnvironment } from '../environment';

@Injectable()
export class EndpointsService {

  _apiEndPoint: string;

  constructor(/*@Inject(EnvVariables) public envVariables: IEnvironment*/) {
    this._apiEndPoint = 'http://localhost:4300' // this.envVariables.apiEndpoint;
  }

  getAuth() {
    return this._apiEndPoint + '/api/authenticate';
  }

  getLogin() {
    return this._apiEndPoint + '/login';
  }

  getSignup() {
    return this._apiEndPoint + '/signin';
  }

}
