import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../shared/models/register';
import { environment } from 'src/environments/environment.development';
import { Login } from '../shared/models/login';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpClient: HttpClient) { }

  login(model: Login) {
    return this.httpClient.post(`${environment.appUrl}/api/auth/login`, model);
  }

  register(model: Register) {
    return this.httpClient.post(`${environment.appUrl}/api/auth/register`, model);
  }
}
