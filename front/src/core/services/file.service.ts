import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';

import { EndpointsService } from './endpoints';

@Injectable()
export class FileService {

  constructor(private readonly http: HttpClient,
              private readonly endpoints: EndpointsService) {}

  // Upload file.
  public upload(file) {
    return this.http.post(this.endpoints.fileUpload(), file)
      .pipe(
        shareReplay(),
        catchError(err => throwError(this._manageError(err)))
      );
  }

  // View file.
  public view(fileID) {
    if (fileID) {
      return this.http.get(this.endpoints.filePath(fileID), { responseType: 'blob' }).pipe(
        shareReplay(),
        map(blob => window.URL.createObjectURL(blob),
        catchError(err => throwError(this._manageError(err)))
      ));
    }
    return of(null);
  }

  // Remove file.
  public remove(fileID) {
    return this.http.get(this.endpoints.fileRemove(fileID))
      .pipe(
        shareReplay(),
        catchError(err => throwError(this._manageError(err)))
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
