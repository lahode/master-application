import { Injectable } from '@angular/core';

@Injectable()
export class ErrorHandlerService {

  // Manage back-end error with JSON API
  public errorJSONAPI(err: any): string {
    if (err.hasOwnProperty('errors') && err.errors.length > 0) {
      return `${err.errors[0].status} - ${err.errors[0].title}. ${err.errors[0].detail}`;
    }
    return 'Erreur de connexion avec le serveur';
  }

  // Manage back-end error with standard HTTP calls
  public errorHTTP(err: any): string {
    const error = err.error;
    if (error.hasOwnProperty('msg') && error.msg) {
      return error.msg;
    }
    return 'Erreur de connexion avec le serveur';
  }

  // Manage back-end error with oauth2
  public errorToken(err: any): string {
    return 'Erreur de connexion avec le serveur';
  }

}
