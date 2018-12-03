import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError, of } from 'rxjs';
import { map, tap, shareReplay, catchError, take } from 'rxjs/operators';

import { EndpointsService } from './endpoints';
import { ErrorHandlerService } from './errorhandler.service';
import { saveAs } from 'file-saver';

@Injectable()
export class FileService {

  constructor(private readonly http: HttpClient,
              private readonly endpoints: EndpointsService,
              private readonly _error: ErrorHandlerService) {}

  // Upload file.
  public upload(file) {
    return this.http.post(this.endpoints.fileUpload(), file)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // View file.
  public view(fileID) {
    if (fileID) {
      return this.http.get(this.endpoints.filePath(fileID), { responseType: 'blob' }).pipe(
        shareReplay(),
        map(blob => window.URL.createObjectURL(blob),
        catchError(err => throwError(this._error.errorHTTP(err)))
      ));
    }
    return of(null);
  }

  // Download file.
  public download(fileID, filename) {
    if (fileID) {
      this.http.get(this.endpoints.filePath(fileID), { responseType: 'blob' }).pipe(
        shareReplay(),
        catchError(err => throwError(this._error.errorHTTP(err))),
        take(1),
        tap(blob => saveAs(blob, filename))
      ).subscribe();
    }
  }

  // Remove file.
  public remove(fileID) {
    return this.http.get(this.endpoints.fileRemove(fileID))
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

}
