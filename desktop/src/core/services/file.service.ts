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
        return Observable.throw(this.manageError(err))}
      );
  }

  // Manage back-end error
  private manageError(err) {
    if (err.ok === 0 && err.statusText.length === 0) {
      err.statusText = 'Erreur de connexion avec le back-end';
    }
    return err;
  }

}
