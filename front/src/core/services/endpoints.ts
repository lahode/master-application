import { Injectable, Inject } from '@angular/core';

import { Range } from '../models/range';

@Injectable()
export class EndpointsService {

  private url = 'http://localhost:4300';

  // Endpoint for AuthService
  checkAuth() {
    return this.url + '/api/secure/check-auth';
  }

  checkPermissions() {
    return this.url + '/api/secure/check-permissions';
  }

  login() {
    return this.url + '/api/login';
  }

  logout() {
    return this.url + '/api/secure/logout';
  }

  signup() {
    return this.url + '/api/signup';
  }

  getPassword() {
    return this.url + '/api/retrieve-password';
  }

  // Endpoint for UserService
  userList(range?: Range) {
    return (range) ? this.url + `/api/secure/users/list/${range.from}/${range.to}` : this.url + '/api/secure/users/list';
  }

  userDetail(id: string) {
    return this.url + `/api/secure/users/get/${id}`;
  }

  userCreate() {
    return this.url + '/api/secure/users/create';
  }

  userUpdate() {
    return this.url + '/api/secure/users/update';
  }

  userRemove(id: string) {
    return this.url + `/api/secure/users/remove/${id}`;
  }

  // Endpoint for RoleService
  roleList() {
    return this.url + '/api/secure/roles/list';
  }

  getPermissions() {
    return this.url + '/api/secure/roles/get-permissions';
  }

  roleDetail(id: string) {
    return this.url + `/api/secure/roles/get/${id}`;
  }

  roleCreate() {
    return this.url + '/api/secure/roles/create';
  }

  roleUpdate() {
    return this.url + '/api/secure/roles/update';
  }

  roleRemove(id: string) {
    return this.url + `/api/secure/roles/remove/${id}`;
  }

  // Endpoint for FileService
  fileUpload() {
    return this.url + '/api/secure/files/upload';
  }

  filePath(id) {
    return this.url + `/api/secure/files/view/${id}`;
  }

}
