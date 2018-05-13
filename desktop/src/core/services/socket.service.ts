import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// import * as socketIo from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable()
export class SocketService {

  // private socket: SocketIOClient.Socket;

  public connect(): Observable<any> {
    return of(null);
/*
    this.socket = socketIo(this._getConfig().baseUrl, this._getConfig().config);
    return new Observable( observer => {
      this.socket.on('connect', () => {
        observer.next(true);
      });
      this.socket.on('disconnect', () => {
        observer.next(false);
      });
    });
*/
  }

  public disconnect(): Observable<any> {
    return of(null);
/*
    this.socket.disconnect();
    return new Observable( observer => {
      observer.next(false);
    });
*/
  }

  public emit(event: string, data?: any) {
//    this.socket.emit(event, data);
  }

  public listen(event: string): Observable<any> {
    return of(null);
/*
    return new Observable( observer => {
      this.socket.on(event, data => {
        observer.next(data);
      });
      return () => this.socket.off(event);
    });
*/
  }

  private _getConfig() {
    return <any>environment.socket;
  }

}
