import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';

import { throwError, of, BehaviorSubject, Observable } from 'rxjs';
import { map, tap, shareReplay, catchError } from 'rxjs/operators';

import { EndpointsService } from './endpoints';
import { ErrorHandlerService } from './errorhandler.service';
import { saveAs } from 'file-saver';

@Injectable()
export class FileService {

  protected messageStatus: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public messageStatus$: Observable<any> = this.messageStatus.asObservable();

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
  public download(fileID, filename = '') {
    const downloadRequest = new HttpRequest('GET', this.endpoints.filePath(fileID), {
      reportProgress: true,
      responseType: 'blob'
    });
    this.http.request(downloadRequest).pipe(
      map(event => this.getEventMessage(event)),
      tap(message => {
        if (message && message.status && message.status === 200) {
          if (!filename) {
            const contentDisposition = message.headers.get('Content-disposition') || '';
            const matches = /filename=([^;]+)/ig.exec(contentDisposition);
            filename = (matches[1] || 'untitled').trim();
          }
          saveAs(message.body, filename);
        }
      }),
      catchError(err => throwError(this._error.errorHTTP(err)))
    ).subscribe();
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

  // Get Event message when download or uploading.
  private getEventMessage(event: any) {
    switch (event.type) {
      // Event when upload is complete.
      case HttpEventType.Sent:
        this.messageStatus.next({type: 'uploaded', status: true, percent: 100});
        return event;

      // Compute and show the % done on upload.
      case HttpEventType.UploadProgress:
        const percentUploadDone = Math.round(100 * event.loaded / event.total);
        this.messageStatus.next({type: 'uploading', status: true, percent: percentUploadDone});
        return event;

      // Event when download is complete.
      case HttpEventType.Response:
        this.messageStatus.next({type: 'downloaded', status: true, percent: 100});
        return event;

      // Compute and show the % done on download.
      case HttpEventType.DownloadProgress:
        const percentageDownloadedDone = Math.round(100 * event.loaded / event.total);
        this.messageStatus.next({type: 'downloading', status: true, percent: percentageDownloadedDone});
        return event;

      // Event on custom event.
      case HttpEventType.User:
        this.messageStatus.next({type: 'custom', status: true, percent: 100});
        return event;
    }
  }

}
