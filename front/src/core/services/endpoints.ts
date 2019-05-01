import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable()
export class EndpointsService {

  private _url = environment.server;

  // Endpoint for AuthService
  checkAuth(auth_reset: string) {
    if (auth_reset) {
      return this._url + `/api/secure/check-auth/${auth_reset}`;
    }
    return this._url + '/api/secure/check-auth';
  }

  checkPermissions() {
    return this._url + '/api/secure/check-permissions';
  }

  login() {
    return this._url + '/api/login';
  }

  logout() {
    return this._url + '/api/secure/logout';
  }

  signup() {
    return this._url + '/api/signup';
  }

  getPassword() {
    return this._url + '/api/retrieve-password';
  }

  resetPassword() {
    return this._url + '/api/init-password';
  }

  // Endpoint for FileService
  fileUpload(folderName: string) {
    if (folderName) {
      return this._url + `/api/secure/files/upload/${folderName}`;
    } else {
      return this._url + '/api/secure/files/upload';
    }
  }

  filePath(id: string) {
    return this._url + `/api/secure/files/view/${id}`;
  }

  fileRemove(id: string) {
    return this._url + `/api/secure/files/delete/${id}`;
  }

  fileClean() {
    return this._url + '/api/secure/files/clean';
  }

  // Endpoint for UserService
  userList(range: any, sort?: string, field?: string, value?: string) {
    let url =  this._url + `/api/secure/users/list/${range.from}/${range.to}/${sort}`;
    if (field) {
      url += value ? `/${field}/${value}` : `/${field}`;
    }
    return url;
  }

  userDetail(id: string) {
    if (id) {
      return this._url + `/api/secure/users/get/${id}`;
    } else {
      return this._url + `/api/secure/users/getcurrent`;
    }
  }

  userProfileDetail() {
    return this._url + '/api/secure/profile/get';
  }

  userAll(search?: string) {
    if (search) {
      return this._url + `/api/secure/users/like/${search}`;
    } else {
      return this._url + '/api/secure/users/all';
    }
  }

  userCreate() {
    return this._url + '/api/secure/users/create';
  }

  userUpdate() {
    return this._url + '/api/secure/users/update';
  }

  userProfileUpdate() {
    return this._url + '/api/secure/profile/update';
  }

  userRemove(id: string) {
    return this._url + `/api/secure/users/remove/${id}`;
  }

  userReset(id: string) {
    return this._url + `/api/secure/users/reset-auth/${id}`;
  }

  // Endpoint for RoleService
  roleList() {
    return this._url + '/api/secure/roles/list';
  }

  getPermissions() {
    return this._url + '/api/secure/roles/get-permissions';
  }

  roleDetail(id: string) {
    return this._url + `/api/secure/roles/get/${id}`;
  }

  roleCreate() {
    return this._url + '/api/secure/roles/create';
  }

  roleUpdate() {
    return this._url + '/api/secure/roles/update';
  }

  roleRemove(id: string) {
    return this._url + `/api/secure/roles/remove/${id}`;
  }

  // Endpoint for NotificationService
  sendtoEmail() {
    return this._url + '/api/secure/notification/emails';
  }

  // Endpoint for NotificationService
  sendtoUsers() {
    return this._url + '/api/secure/notification/users';
  }

}
