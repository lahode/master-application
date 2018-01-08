import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointsService } from './endpoints';

@Injectable()
export class FileService {

  constructor(private readonly http: HttpClient,
              private readonly endpoints: EndpointsService) {}

  // Upload file
  public upload(file) {
    return this.http.post(this.endpoints.fileUpload(), file)
      .shareReplay()
      .catch(err => {
        return Observable.throw(this._manageError(err))}
      );
  }

  // Manage back-end error
  private _manageError(err) {
    const error = err.error;
    if (error.hasOwnProperty('message') && error.message) {
      return error.message;
    }
    return 'Erreur de connexion avec le serveur';
  }

}
