import { Component, OnInit, TemplateRef } from '@angular/core';
import { MemberView } from '../shared/models/admin/memberViewDto';
import { AdminService } from './admin.service';
import { SharedService } from '../shared/shared.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
 members: MemberView[] = [];
 modalRef?: BsModalRef;
 memberToDelete: MemberView | undefined;

  constructor(private _adminService: AdminService
    , private sharedService: SharedService
    , private modalService: BsModalService) {}

 ngOnInit(): void {
  this._adminService.getMembers().subscribe(res => {
    this.members = res;
  })
 }

 deleteMember(id:string, template: TemplateRef<any>) {
  let member = this.findMember(id);
  if(member) {
    this.memberToDelete = member;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 }

 confirm() {
  if(this.memberToDelete) {
    this._adminService.deleteMember(this.memberToDelete.id).subscribe( _ => {
      this.sharedService.showNotification(true, "deleted", `member of ${this.memberToDelete?.userName} has been deleted.`);
      this.members = this.members.filter(x => x.id !== this.memberToDelete?.id);
      this.memberToDelete = undefined;
      this.modalRef?.hide();
    })
  }
 }

 decline() {
  this.modalRef?.hide();
 }

 lockMember(id: string) {
  this._adminService.lockMember(id).subscribe( _ => {
    this.handleLockUnlockFilterAndMessage(id, true);
  })
 }

 unlockMember(id: string) {
  this._adminService.unlockMember(id).subscribe( _ => {
    this.handleLockUnlockFilterAndMessage(id, false);
  })
 }

 private handleLockUnlockFilterAndMessage(id: string, locking: boolean) {
  let member = this.findMember(id);
  if(member) {
    member.isLocked = !member.isLocked;
    if(locking) {
      this.sharedService.showNotification(true, "locked", `${member.userName} member has been locked`);
    } else {
      this.sharedService.showNotification(false, "unlocked", `${member.userName} member has been unlocked`);
    }
  }
 }

 findMember(id: string): MemberView | undefined {
  let member = this.members.find(x => x.id == id);
  if(member)
    return member;

  return undefined;
 }
}
