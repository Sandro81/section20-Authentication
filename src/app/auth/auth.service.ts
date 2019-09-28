import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';


interface AuthResponseData {
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
    ).pipe(catchError(errorRes => {
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
      switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email exists already';
      }
      return throwError(errorMessage);
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCsTGkCaNQTVXIDu54N7FrRT84tog-vcds',
      {
        email: email,
        password: password,
        returnSecureToken: true
      });
  }
}
