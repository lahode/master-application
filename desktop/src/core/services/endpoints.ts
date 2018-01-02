import { Injectable, Inject } from '@angular/core';
import { environment } from '../../environments/environment';

import { Range } from '../models/range';

@Injectable()
export class EndpointsService {

  _apiEndPoint: string;

  constructor() {
    this._apiEndPoint = environment.apiEndpoint;
  }

  // Endpoint for AuthService
  checkAuth() {
    return this._apiEndPoint + '/api/check-auth';
  }

  checkPermissions() {
    return this._apiEndPoint + '/api/check-permissions';
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

  // Endpoint for UserService
  userList(range?: Range) {
    return (range) ? this._apiEndPoint + `/api/users/list/${range.from}/${range.to}` : this._apiEndPoint + '/api/users/list';
  }

  userDetail(id: string) {
    return this._apiEndPoint + `/api/users/get/${id}`;
  }

  userCreate() {
    return this._apiEndPoint + '/api/users/create';
  }

  userUpdate() {
    return this._apiEndPoint + '/api/users/update';
  }

  userRemove(id: string) {
    return this._apiEndPoint + `/api/users/remove/${id}`;
  }

  // Endpoint for RoleService
  roleList() {
    return this._apiEndPoint + '/api/roles/list';
  }

  getPermissions() {
    return this._apiEndPoint + '/api/roles/get-permissions';
  }

  roleDetail(id: string) {
    return this._apiEndPoint + `/api/roles/get/${id}`;
  }

  roleCreate() {
    return this._apiEndPoint + '/api/roles/create';
  }

  roleUpdate() {
    return this._apiEndPoint + '/api/roles/update';
  }

  roleRemove(id: string) {
    return this._apiEndPoint + `/api/roles/remove/${id}`;
  }

  // Endpoint for FileService
  fileUpload() {
    return this._apiEndPoint + '/api/files/upload';
  }

  filePath() {
    return this._apiEndPoint + `/files/view/`;
  }

}
