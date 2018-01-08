import { Injectable, Inject } from '@angular/core';

import { Range } from '../models/range';

@Injectable()
export class EndpointsService {

  // Endpoint for AuthService
  checkAuth() {
    return '/api/secure/check-auth';
  }

  checkPermissions() {
    return '/api/secure/check-permissions';
  }

  login() {
    return '/api/login';
  }

  logout() {
    return '/api/secure/logout';
  }

  signup() {
    return '/api/signup';
  }

  getPassword() {
    return '/api/retrieve-password';
  }

  // Endpoint for UserService
  userList(range?: Range) {
    return (range) ? `/api/secure/users/list/${range.from}/${range.to}` : '/api/secure/users/list';
  }

  userDetail(id: string) {
    return `/api/secure/users/get/${id}`;
  }

  userCreate() {
    return '/api/secure/users/create';
  }

  userUpdate() {
    return '/api/secure/users/update';
  }

  userRemove(id: string) {
    return `/api/secure/users/remove/${id}`;
  }

  // Endpoint for RoleService
  roleList() {
    return '/api/secure/roles/list';
  }

  getPermissions() {
    return '/api/secure/roles/get-permissions';
  }

  roleDetail(id: string) {
    return `/api/secure/roles/get/${id}`;
  }

  roleCreate() {
    return '/api/secure/roles/create';
  }

  roleUpdate() {
    return '/api/secure/roles/update';
  }

  roleRemove(id: string) {
    return `/api/secure/roles/remove/${id}`;
  }

  // Endpoint for FileService
  fileUpload() {
    return '/api/files/upload';
  }

  filePath() {
    return `/files/view/`;
  }

}
