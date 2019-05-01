import { Injectable } from '@angular/core';

@Injectable()
export class ErrorHandlerService {

  // Manage back-end error with standard HTTP calls
  public errorHTTP(err: any): string {
    if (err.error && err.error.msg) {
      return err.error.msg;
    }
    return 'Erreur de connexion avec le serveur';
  }

}
