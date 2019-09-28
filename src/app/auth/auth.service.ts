import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';


export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  resfreshTocken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}



@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCsTGkCaNQTVXIDu54N7FrRT84tog-vcds',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
      .pipe(catchError( this.handleError));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCsTGkCaNQTVXIDu54N7FrRT84tog-vcds',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError( this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    /*
https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
Common error codes

EMAIL_EXISTS: The email address is already in use by another account.
OPERATION_NOT_ALLOWED: Password sign-in is disabled for this project.
TOO_MANY_ATTEMPTS_TRY_LATER: We have blocked all requests from this device due to unusual activity. Try again later.
*/
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    console.log('error Message' + errorRes.error.error.message);
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email was not found';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}
