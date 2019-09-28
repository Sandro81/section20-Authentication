import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  signup(email: string, password: string) {
    this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCsTGkCaNQTVXIDu54N7FrRT84tog-vcds',
      {
        email: email,
        password: password,
        returnSecuureToken: true
      }
    );
  }
}
