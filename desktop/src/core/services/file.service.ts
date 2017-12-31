import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointsService } from './endpoints';

@Injectable()
export class FileService {

  constructor(private readonly authHttp: AuthHttp,
              private readonly endpoints: EndpointsService) {}

  // Upload file
  public upload(file) {
    return this.authHttp.post(this.endpoints.fileUpload(), file)
      .map(response => response.json())
      .catch(err => {
        return Observable.throw(this._manageError(err))}
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
