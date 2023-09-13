import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { User } from '../shared/models/account/user';

@Injectable({
  providedIn: 'root'
})
export class PlayService {

  constructor(private httpClient: HttpClient) { }

  getPlayer() {
    return this.httpClient.get(`${environment.appUrl}/api/play`);
  }
}
