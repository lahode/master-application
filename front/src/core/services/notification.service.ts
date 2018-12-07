import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { shareReplay, map, catchError } from 'rxjs/operators';

import { EndpointsService } from './endpoints';
import { ErrorHandlerService } from './errorhandler.service';

@Injectable()
export class NotificationService {

  constructor(private readonly _http: HttpClient,
              private readonly _endpoints: EndpointsService,
              private readonly _error: ErrorHandlerService) {}

  // Send emails to a list of emails (data can contain email or emails value).
  public sendToEmails(data) {
    return this._http.post(this._endpoints.sendtoUsers(), data)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }

  // Send emails to a list of users (data can contain userID or users value).
  public sendToUsers(data) {
    return this._http.post(this._endpoints.sendtoUsers(), data)
      .pipe(
        shareReplay(),
        map(response => <any>(response as any).data),
        catchError(err => throwError(this._error.errorHTTP(err)))
      );
  }
}
