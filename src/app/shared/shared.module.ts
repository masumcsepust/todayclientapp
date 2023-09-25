import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ValidationMessagesComponent } from './components/errors/validation-messages/validation-messages.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NotificationComponent } from './models/notification/notification.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { UserHasRoleDirective } from './directives/user-has-role.directive';


@NgModule({
  declarations: [
    NotFoundComponent,
    ValidationMessagesComponent,
    NotificationComponent,
    UserHasRoleDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot()
  ],
  exports: [
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    ValidationMessagesComponent,
    UserHasRoleDirective
  ]
})
export class SharedModule { }
