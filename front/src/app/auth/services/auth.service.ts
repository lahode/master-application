import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export abstract class AuthService {

  // Check authentification
  public abstract checkAuth(arg: any): Observable<any>;

  // Check permissions
  public abstract checkPermissions(permissions: string[]): Observable<any>;

  // Log in
  public abstract login(values: any): Observable<any>;

  // Log out
  public abstract logout(): Observable<any>;

  // Sign up
  public abstract signup(values: any): Observable<any>;

  // Retrieve password.
  public abstract retrievePassword(values: any): Observable<any>;

  // Reset password.
  public abstract resetPassword(values: any): Observable<any>;

  // Handle authentication for third party authentication.
  public abstract handleAuthentication(): Promise<any>;

}
