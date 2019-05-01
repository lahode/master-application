import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';

import { throwError, of, BehaviorSubject, Observable } from 'rxjs';
import { take, map, tap, shareReplay, catchError } from 'rxjs/operators';

import { EndpointsService } from './endpoints';
import { ErrorHandlerService } from './errorhandler.service';
import { saveAs } from 'file-saver';

@Injectable()
export class FileService {

  protected messageStatus: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public messageStatus$: Observable<any> = this.messageStatus.asObservable();

  constructor(private readonly _http: HttpClient,
              private readonly _endpoints: EndpointsService,
              private readonly _error: ErrorHandlerService) {}

  // Upload file.
  public upload(file: FormData, folderName = null) {
    return this._http.post(this._endpoints.fileUpload(folderName), file)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // View file.
  public view(fileID: string) {
    if (fileID) {
      return this._http.get(this._endpoints.filePath(fileID), { responseType: 'blob' }).pipe(
        shareReplay(),
        map(blob => window.URL.createObjectURL(blob),
        catchError(err => throwError(this._error.errorHTTP(err)))
      ));
    }
    return of(null);
  }

  // Download file.
  public download(fileID: string, filename = '') {
    const downloadRequest = new HttpRequest('GET', this._endpoints.filePath(fileID), {
      reportProgress: true,
      responseType: 'blob'
    });
    this._http.request(downloadRequest).pipe(
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
  public remove(fileID: string) {
    return this._http.get(this._endpoints.fileRemove(fileID))
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Clean temporary files.
  public fileClean() {
    return this._http.get(this._endpoints.fileClean())
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data),
        catchError(err => throwError(this._error.errorHTTP(err)))
      ).pipe(take(1)).subscribe();
  }

  // Get Event message when download or uploading.
  public getEventMessage(event: any) {
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

@Injectable()
export class ImageDataConverterService {

  private _dataURI: string;

  // Tranform base64 data to a blob.
  public dataURItoBlob(dataURI: string): Blob {
    this._dataURI = dataURI;
    const mimeString = this._getMimeString();
    const intArray = this._convertToTypedArray();
    return new Blob([intArray], {type: mimeString});
  }

  // Retrieve the MIME type in the base64.
  private _getMimeString(): string {
    return this._dataURI.split(',')[0].split(':')[1].split(';')[0];
  }

  // Convert base64 data to a typed array.
  private _convertToTypedArray(): Uint8Array {
    const byteString = this._getByteString();
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return ia;
  }

  // Decode base64 to byte string.
  private _getByteString(): string {
    let byteString: string;
    if (this._dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(this._dataURI.split(',')[1]);
    } else {
      byteString = decodeURI(this._dataURI.split(',')[1]);
    }
    return byteString;
  }

}
