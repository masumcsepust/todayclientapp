import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../shared/models/account/register';
import { environment } from 'src/environments/environment.development';
import { Login } from '../shared/models/account/login';
import { User } from '../shared/models/account/user';
import { ReplaySubject, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmEmail } from '../shared/models/account/confirm-email';
import { ResetPassword } from '../shared/models/account/reset-password';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userService = new ReplaySubject<User | null>(1);
  user$ = this.userService.asObservable();
  constructor(private httpClient: HttpClient
    , private router: Router
    ) { }

  refreshUser(jwt: string | null) {
    if(jwt==null) {
      this.userService.next(null);
      return of(undefined);
    }

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + jwt);
    return this.httpClient.get<User>(`${environment.appUrl}/api/auth/refresh-user-token`, {headers}).pipe(
      map((user: User) => {
        if(user) {
          this.setUser(user);
        }
      })
    );
  }

  login(model: Login) {
    return this.httpClient.post<User>(`${environment.appUrl}/api/auth/login`, model).pipe(
      map((user: User) => {
        if(user) {
          this.setUser(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(environment.userKey);
    this.userService.next(null);
    this.router.navigateByUrl('/');
  }

  register(model: Register) {
    return this.httpClient.post(`${environment.appUrl}/api/auth/register`, model);
  }

  confirmEmail(model: ConfirmEmail) {
    return this.httpClient.put(`${environment.appUrl}/api/auth/confirm-email`, model);
  }

  resendEmailConfirmationLink(email: string) {
    return this.httpClient.post(`${environment.appUrl}/api/auth/resend-email-confirmation-link/${email}`, {});
  }

  forgotUserNameOrPassword(email: string) {
    return this.httpClient.post(`${environment.appUrl}/api/auth/forgot-username-or-password/${email}`, {});
  }
  resetPassword(model: ResetPassword) {
    return this.httpClient.put(`${environment.appUrl}/api/auth/reset-password`, model);
  }

  getJWT() {
    const key = localStorage.getItem(environment.userKey);
    if(key) {
      const user : User = JSON.parse(key);
      return user.jwt;
    } else {
      return null;
    }
  }

  private setUser(user: User) {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userService.next(user);
  }
}
