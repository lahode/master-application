import { Injectable, Inject } from '@angular/core';

import { Range } from '../models/range';
import { environment } from '../../environments/environment';

@Injectable()
export class EndpointsService {

  private url = environment.server;

  // Endpoint for AuthService
  checkAuth(auth_reset: string) {
    if (auth_reset) {
      return this.url + `/api/secure/check-auth/${auth_reset}`;
    }
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

  resetPassword() {
    return this.url + '/api/init-password';
  }

  // Endpoint for UserService
  userList(range: any, sort?: string, field?: string, value?: string) {
    let url =  this.url + `/api/secure/users/list/${range.from}/${range.to}/${sort}`;
    if (field) {
      url += value ? `/${field}/${value}` : `/${field}`;
    }
    return url;
  }

  userDetail(id: string) {
    return this.url + `/api/secure/users/get/${id}`;
  }

  userProfileDetail() {
    return this.url + '/api/secure/profile/get';
  }

  userAll() {
    return this.url + '/api/secure/users/all';
  }

  userCreate() {
    return this.url + '/api/secure/users/create';
  }

  userUpdate() {
    return this.url + '/api/secure/users/update';
  }

  userProfileUpdate() {
    return this.url + '/api/secure/profile/update';
  }

  userRemove(id: string) {
    return this.url + `/api/secure/users/remove/${id}`;
  }

  userReset(id: string) {
    return this.url + `/api/secure/users/reset-auth/${id}`;
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

  fileRemove(id) {
    return this.url + `/api/secure/files/delete/${id}`;
  }

  // Endpoint for NotificationService
  sendtoEmail() {
    return this.url + '/api/secure/notification/emails';
  }

  // Endpoint for NotificationService
  sendtoUsers() {
    return this.url + '/api/secure/notification/users';
  }

}
