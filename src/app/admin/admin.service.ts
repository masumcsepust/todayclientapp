import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MemberView } from '../shared/models/admin/memberViewDto';
import { environment } from 'src/environments/environment.development';
import { MemberAddEdit } from '../shared/models/admin/memberAddEditDto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient: HttpClient) { }

  getMembers() {
    return this.httpClient.get<MemberView[]>(`${environment.appUrl}/api/admin/get-members`);
  }

  getMember(id: string) {
    return this.httpClient.get<MemberAddEdit>(`${environment.appUrl}/api/admin/get-member/${id}`);
  }

  lockMember(id: string) {
    return this.httpClient.put(`${environment.appUrl}/api/admin/lock-member/${id}`, {});
  }

  unlockMember(id: string) {
    return this.httpClient.put(`${environment.appUrl}/api/admin/unlock-member/${id}`, {});
  }

  deleteMember(id: string) {
    return this.httpClient.delete(`${environment.appUrl}/api/admin/delete/${id}`);
  }

  getApplicationRoles() {
    return this.httpClient.get<string[]>(`${environment.appUrl}/api/admin/get-application-roles`);
  }

  addEditMember(model: MemberAddEdit) {
    return this.httpClient.post(`${environment.appUrl}/api/admin/add-edit-member`, model);
  }
}
