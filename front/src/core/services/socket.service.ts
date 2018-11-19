import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as socketIo from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable()
export class SocketService {

  private socket: SocketIOClient.Socket;

  public connect(): Observable<any> {
    this.socket = socketIo(environment.server);
    return new Observable( observer => {
      this.socket.on('connect', () => {
        observer.next(true);
      });
      this.socket.on('disconnect', () => {
        observer.next(false);
      });
    });
  }

  public disconnect(): Observable<any> {
    this.socket.disconnect();
    return new Observable( observer => {
      observer.next(false);
    });
  }

  public emit(event: any, data?: any) {
    this.socket.emit(event, data);
  }

  public listen(event: any): Observable<any> {
    return new Observable( observer => {
      this.socket.on(event, data => {
        observer.next(data);
      });
      return () => this.socket.off(event);
    });
  }

  private _getConfig() {
    return <any>environment.socket;
  }

}
